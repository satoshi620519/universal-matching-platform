import { Injectable } from '@nestjs/common';
import {
  createMatchTransitionCommand,
  resolveMatchTransition,
  type MatchTransitionCommand,
  type MatchTransitionRepository,
  type MatchTransitionResult,
} from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class PrismaMatchTransitionRepository implements MatchTransitionRepository {
  constructor(private readonly database: DatabaseService) {}

  async transition(input: MatchTransitionCommand): Promise<MatchTransitionResult> {
    const command = createMatchTransitionCommand(input);
    return this.database.$transaction(async (tx) => {
      await this.lockPair(tx, command.actorAccountId, command.targetAccountId);
      await this.lockIdempotency(tx, command.actorAccountId, command.idempotencyKey);
      const existing = await tx.matchInteraction.findUnique({
        where: { actorAccountId_idempotencyKey: { actorAccountId: command.actorAccountId, idempotencyKey: command.idempotencyKey } },
      });
      if (existing) return this.resultFor(existing, true, tx);

      const interaction = await tx.matchInteraction.create({
        data: {
          actorAccountId: command.actorAccountId,
          targetAccountId: command.targetAccountId,
          decision: command.decision,
          idempotencyKey: command.idempotencyKey,
        },
      });
      const result = await this.resultFor(interaction, false, tx);
      if (result.mutual) {
        await tx.notification.createMany({
          data: [
            { accountId: interaction.actorAccountId, kind: 'match.mutual', payload: { targetAccountId: interaction.targetAccountId } },
            { accountId: interaction.targetAccountId, kind: 'match.mutual', payload: { targetAccountId: interaction.actorAccountId } },
          ],
        });
      }
      return result;
    });
  }

  async isMutualMatch(firstAccountId: string, secondAccountId: string): Promise<boolean> {
    const [forward, reverse] = await Promise.all([
      this.database.matchInteraction.findUnique({ where: { actorAccountId_targetAccountId: { actorAccountId: firstAccountId, targetAccountId: secondAccountId } } }),
      this.database.matchInteraction.findUnique({ where: { actorAccountId_targetAccountId: { actorAccountId: secondAccountId, targetAccountId: firstAccountId } } }),
    ]);
    return forward?.decision === 'like' && reverse?.decision === 'like';
  }

  private async lockPair(
    tx: { $executeRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown> },
    firstAccountId: string,
    secondAccountId: string,
  ): Promise<void> {
    const pair = [firstAccountId, secondAccountId].sort().join(':');
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${pair}, 0))`;
  }

  private async lockIdempotency(
    tx: { $executeRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown> },
    actorAccountId: string,
    idempotencyKey: string,
  ): Promise<void> {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`${actorAccountId}:${idempotencyKey}`}, 0))`;
  }

  private async resultFor(
    interaction: { decision: string; actorAccountId: string; targetAccountId: string },
    replayed: boolean,
    tx: Pick<DatabaseService, 'matchInteraction' | 'notification'>,
  ): Promise<MatchTransitionResult> {
    const reciprocal = await tx.matchInteraction.findUnique({
      where: {
        actorAccountId_targetAccountId: {
          actorAccountId: interaction.targetAccountId,
          targetAccountId: interaction.actorAccountId,
        },
      },
    });
    return {
      ...resolveMatchTransition(
        interaction.decision as 'like' | 'pass',
        reciprocal?.decision as 'like' | 'pass' | undefined,
      ),
      replayed,
    };
  }
}

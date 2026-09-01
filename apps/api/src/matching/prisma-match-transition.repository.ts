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

      try {
        const interaction = await tx.matchInteraction.create({ data: {
          actorAccountId: command.actorAccountId, targetAccountId: command.targetAccountId,
          decision: command.decision, idempotencyKey: command.idempotencyKey,
        }});
        return this.resultFor(interaction, false, tx);
      } catch (error) {
        if (!(error instanceof Error) || !('code' in error) || (error as { code?: string }).code !== 'P2002') throw error;
        const replay = await tx.matchInteraction.findUnique({
          where: { actorAccountId_idempotencyKey: { actorAccountId: command.actorAccountId, idempotencyKey: command.idempotencyKey } },
        });
        if (replay) return this.resultFor(replay, true, tx);
        throw error;
      }
    });
  }

  private async lockPair(
    tx: { $executeRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown> },
    firstAccountId: string,
    secondAccountId: string,
  ): Promise<void> {
    const pair = [firstAccountId, secondAccountId].sort().join(':');
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${pair}))`;
  }

  private async lockIdempotency(
    tx: { $executeRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown> },
    actorAccountId: string,
    idempotencyKey: string,
  ): Promise<void> {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${actorAccountId}:${idempotencyKey}`}))`;
  }

  private async resultFor(
    interaction: { decision: string; actorAccountId: string; targetAccountId: string },
    replayed: boolean,
    tx: Pick<DatabaseService, 'matchInteraction'>,
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

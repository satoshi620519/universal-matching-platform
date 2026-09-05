import { ForbiddenException, Injectable, Optional } from '@nestjs/common';
import {
  blocksCapability,
  createMatchTransitionCommand,
  resolveMatchTransition,
  type MatchTransitionCommand,
  type MatchTransitionRepository,
  type MatchTransitionResult,
} from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';
import { NotificationRealtimePublicationService } from '../messaging/notification-realtime-publication.service.js';
import { EffectiveSafetyRestrictionService } from '../safety/effective-safety-restriction.service.js';
import { UserBlockRepository } from '../safety/user-block.repository.js';

@Injectable()
export class PrismaMatchTransitionRepository implements MatchTransitionRepository {
  constructor(
    private readonly database: DatabaseService,
    private readonly notificationRealtime: NotificationRealtimePublicationService,
    @Optional() private readonly safety?: EffectiveSafetyRestrictionService,
    @Optional() private readonly blocks?: UserBlockRepository,
  ) {}

  async transition(input: MatchTransitionCommand): Promise<MatchTransitionResult> {
    const command = createMatchTransitionCommand(input);
    await this.assertMatchAllowed(command.actorAccountId);
    await this.assertMatchAllowed(command.targetAccountId);
    await this.assertPairNotBlocked(command.actorAccountId, command.targetAccountId);
    const outcome = await this.database.$transaction(async (tx) => {
      await this.lockPair(tx, command.actorAccountId, command.targetAccountId);
      await this.lockIdempotency(tx, command.actorAccountId, command.idempotencyKey);
      const existing = await tx.matchInteraction.findUnique({ where: { actorAccountId_idempotencyKey: { actorAccountId: command.actorAccountId, idempotencyKey: command.idempotencyKey } } });
      if (existing) return { result: await this.resultFor(existing, true, tx), notifications: [] };
      const interaction = await tx.matchInteraction.create({ data: { actorAccountId: command.actorAccountId, targetAccountId: command.targetAccountId, decision: command.decision, idempotencyKey: command.idempotencyKey } });
      const result = await this.resultFor(interaction, false, tx);
      const notifications = result.mutual ? await Promise.all([
        tx.notification.create({ data: { accountId: interaction.actorAccountId, kind: 'match.mutual', payload: { targetAccountId: interaction.targetAccountId } } }),
        tx.notification.create({ data: { accountId: interaction.targetAccountId, kind: 'match.mutual', payload: { targetAccountId: interaction.actorAccountId } } }),
      ]) : [];
      return { result, notifications };
    });
    if (outcome.notifications.length) void this.notificationRealtime.publishCreated({ notificationIds: outcome.notifications.map(notification => notification.id), recipientAccountIds: outcome.notifications.map(notification => notification.accountId) }).catch(() => undefined);
    return outcome.result;
  }

  async isMutualMatch(firstAccountId: string, secondAccountId: string): Promise<boolean> {
    const [forward, reverse] = await Promise.all([
      this.database.matchInteraction.findUnique({ where: { actorAccountId_targetAccountId: { actorAccountId: firstAccountId, targetAccountId: secondAccountId } } }),
      this.database.matchInteraction.findUnique({ where: { actorAccountId_targetAccountId: { actorAccountId: secondAccountId, targetAccountId: firstAccountId } } }),
    ]);
    return forward?.decision === 'like' && reverse?.decision === 'like';
  }

  private async assertMatchAllowed(accountId: string): Promise<void> {
    if (!this.safety) return;
    const restriction = await this.safety.resolveForAccount(accountId, 'general');
    if (blocksCapability(restriction, 'general')) throw new ForbiddenException('account is restricted from matching');
  }

  private async assertPairNotBlocked(firstAccountId: string, secondAccountId: string): Promise<void> {
    if (!this.blocks) return;
    const [forward, reverse] = await Promise.all([
      this.blocks.exists(firstAccountId, secondAccountId),
      this.blocks.exists(secondAccountId, firstAccountId),
    ]);
    if (forward || reverse) throw new ForbiddenException('interaction is blocked between these accounts');
  }

  private async lockPair(tx: { $executeRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown> }, firstAccountId: string, secondAccountId: string): Promise<void> {
    const pair = [firstAccountId, secondAccountId].sort().join(':');
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${pair}, 0))`;
  }
  private async lockIdempotency(tx: { $executeRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown> }, actorAccountId: string, idempotencyKey: string): Promise<void> {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`${actorAccountId}:${idempotencyKey}`}, 0))`;
  }
  private async resultFor(interaction: { decision: string; actorAccountId: string; targetAccountId: string }, replayed: boolean, tx: Pick<DatabaseService, 'matchInteraction'>): Promise<MatchTransitionResult> {
    const reciprocal = await tx.matchInteraction.findUnique({ where: { actorAccountId_targetAccountId: { actorAccountId: interaction.targetAccountId, targetAccountId: interaction.actorAccountId } } });
    return { ...resolveMatchTransition(interaction.decision as 'like' | 'pass', reciprocal?.decision as 'like' | 'pass' | undefined), replayed };
  }
}

import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaMatchTransitionRepository } from './prisma-match-transition.repository.js';

const url = process.env.MATCHING_TEST_DATABASE_URL;
const integration = url ? describe : describe.skip;
const prisma = url ? new PrismaClient({ datasources: { db: { url } } }) : undefined;

integration('PrismaMatchTransitionRepository PostgreSQL concurrency', () => {
  const accountA = '11111111-1111-4111-8111-111111111111';
  const accountB = '22222222-2222-4222-8222-222222222222';
  const accountC = '33333333-3333-4333-8333-333333333333';

  beforeEach(async () => {
    await prisma!.$executeRawUnsafe('TRUNCATE TABLE "match_interactions" CASCADE');
    await prisma!.account.upsert({ where: { id: accountA }, update: {}, create: { id: accountA, status: 'active' } });
    await prisma!.account.upsert({ where: { id: accountB }, update: {}, create: { id: accountB, status: 'active' } });
    await prisma!.account.upsert({ where: { id: accountC }, update: {}, create: { id: accountC, status: 'active' } });
  });

  afterAll(async () => {
    await prisma!.$disconnect();
  });

  it('does not duplicate directed interactions under concurrent identical requests', async () => {
    const repository = new PrismaMatchTransitionRepository(prisma as never);
    const command = { actorAccountId: accountA, targetAccountId: accountB, decision: 'like' as const, idempotencyKey: 'same-request' };
    const results = await Promise.allSettled([repository.transition(command), repository.transition(command)]);
    expect(results.every((result) => result.status === 'fulfilled')).toBe(true);
    const fulfilled = results.filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof repository.transition>>> => result.status === 'fulfilled');
    expect(fulfilled.filter((result) => result.value.replayed)).toHaveLength(1);
    expect(fulfilled.filter((result) => !result.value.replayed)).toHaveLength(1);
    const count = await prisma!.matchInteraction.count({ where: { actorAccountId: command.actorAccountId, targetAccountId: command.targetAccountId } });
    expect(count).toBe(1);
  });

  it('serializes the same actor idempotency key even when conflicting targets race', async () => {
    const repository = new PrismaMatchTransitionRepository(prisma as never);
    const first = { actorAccountId: accountA, targetAccountId: accountB, decision: 'like' as const, idempotencyKey: 'shared-key' };
    const conflicting = { ...first, targetAccountId: accountC };
    const results = await Promise.allSettled([repository.transition(first), repository.transition(conflicting)]);
    expect(results.every((result) => result.status === 'fulfilled')).toBe(true);
    const fulfilled = results.filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof repository.transition>>> => result.status === 'fulfilled');
    expect(fulfilled.filter((result) => result.value.replayed)).toHaveLength(1);
    expect(fulfilled.filter((result) => !result.value.replayed)).toHaveLength(1);
    expect(await prisma!.matchInteraction.count({ where: { actorAccountId: accountA, idempotencyKey: 'shared-key' } })).toBe(1);
  });

  it('serializes reciprocal likes into one pending then one matched transition', async () => {
    const repositoryA = new PrismaMatchTransitionRepository(prisma as never);
    const repositoryB = new PrismaMatchTransitionRepository(prisma as never);
    const a = { actorAccountId: accountA, targetAccountId: accountB, decision: 'like' as const, idempotencyKey: 'a-to-b' };
    const b = { actorAccountId: accountB, targetAccountId: accountA, decision: 'like' as const, idempotencyKey: 'b-to-a' };
    const results = await Promise.all([repositoryA.transition(a), repositoryB.transition(b)]);
    const interactions = await prisma!.matchInteraction.count();
    expect(interactions).toBe(2);
    expect(results.filter((result) => result.mutual)).toHaveLength(1);
    expect(results.filter((result) => result.state === 'matched')).toHaveLength(1);
    expect(results.filter((result) => result.state === 'pending')).toHaveLength(1);
    expect(results.every((result) => result.replayed === false)).toBe(true);
    const matched = results.find((result) => result.state === 'matched')!;
    const pending = results.find((result) => result.state === 'pending')!;
    expect(matched.mutual).toBe(true);
    expect(pending.mutual).toBe(false);
  });
});

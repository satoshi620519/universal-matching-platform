import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaMatchTransitionRepository } from './prisma-match-transition.repository.js';

const url = process.env.MATCHING_TEST_DATABASE_URL;
const integration = url ? describe : describe.skip;
const prisma = url ? new PrismaClient({ datasources: { db: { url } } }) : undefined;

integration('PrismaMatchTransitionRepository PostgreSQL concurrency', () => {
  beforeEach(async () => {
    await prisma!.$executeRawUnsafe('TRUNCATE TABLE "match_interactions" CASCADE');
  });

  afterAll(async () => {
    await prisma!.$disconnect();
  });

  it('does not duplicate directed interactions under concurrent identical requests', async () => {
    const repository = new PrismaMatchTransitionRepository(prisma as never);
    const command = { actorAccountId: '11111111-1111-4111-8111-111111111111', targetAccountId: '22222222-2222-4222-8222-222222222222', decision: 'like' as const, idempotencyKey: 'same-request' };
    await Promise.allSettled([repository.transition(command), repository.transition(command)]);
    const count = await prisma!.matchInteraction.count({ where: { actorAccountId: command.actorAccountId, targetAccountId: command.targetAccountId } });
    expect(count).toBe(1);
  });

  it('documents reciprocal-like concurrency as a database integration gate', async () => {
    const repositoryA = new PrismaMatchTransitionRepository(prisma as never);
    const repositoryB = new PrismaMatchTransitionRepository(prisma as never);
    const a = { actorAccountId: '11111111-1111-4111-8111-111111111111', targetAccountId: '22222222-2222-4222-8222-222222222222', decision: 'like' as const, idempotencyKey: 'a-to-b' };
    const b = { actorAccountId: '22222222-2222-4222-8222-222222222222', targetAccountId: '11111111-1111-4111-8111-111111111111', decision: 'like' as const, idempotencyKey: 'b-to-a' };
    const results = await Promise.all([repositoryA.transition(a), repositoryB.transition(b)]);
    const interactions = await prisma!.matchInteraction.count();
    expect(interactions).toBe(2);
    expect(results.some((result) => result.mutual)).toBe(true);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { PrismaMatchTransitionRepository } from './prisma-match-transition.repository.js';

type Interaction = { decision: 'like' | 'pass'; actorAccountId?: string; targetAccountId?: string };

function databaseFor(sequence: {
  byIdempotency?: Interaction | null;
  create?: Interaction | Error;
  reciprocal?: Interaction | null;
}) {
  const findUnique = vi.fn()
    .mockResolvedValueOnce(sequence.byIdempotency ?? null)
    .mockResolvedValueOnce(sequence.reciprocal ?? null);
  const create = vi.fn().mockImplementation(async () => {
    if (sequence.create instanceof Error) throw sequence.create;
    return sequence.create ?? { decision: 'like' };
  });
  const $executeRaw = vi.fn().mockResolvedValue(undefined);
  const tx = { matchInteraction: { findUnique, create }, $executeRaw };
  return {
    $transaction: vi.fn(async (fn: (value: typeof tx) => unknown) => fn(tx)),
    tx,
  };
}

describe('PrismaMatchTransitionRepository executable transition scenarios', () => {
  const command = { actorAccountId: 'a1', targetAccountId: 'a2', decision: 'like' as const, idempotencyKey: 'k1' };

  it('acquires a transaction-scoped pair lock before reading transition state', async () => {
    const database = databaseFor({ create: { decision: 'like' }, reciprocal: null });
    await new PrismaMatchTransitionRepository(database as never).transition(command);
    expect(database.tx.$executeRaw).toHaveBeenCalledTimes(1);
    expect(database.tx.$executeRaw.mock.calls[0].join('')).toContain('pg_advisory_xact_lock');
  });

  it('replays an existing idempotency key without creating a duplicate', async () => {
    const database = databaseFor({ byIdempotency: { decision: 'like' }, reciprocal: null });
    const result = await new PrismaMatchTransitionRepository(database as never).transition(command);
    expect(result).toMatchObject({ state: 'pending', replayed: true });
    expect(database.tx.matchInteraction.create).not.toHaveBeenCalled();
  });

  it('recovers a unique idempotency race as a replay', async () => {
    const uniqueError = Object.assign(new Error('unique'), { code: 'P2002' });
    const database = databaseFor({ create: uniqueError, reciprocal: { decision: 'like' } });
    database.tx.matchInteraction.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ decision: 'like' }).mockResolvedValueOnce(null);
    const result = await new PrismaMatchTransitionRepository(database as never).transition(command);
    expect(result.replayed).toBe(true);
    expect(database.tx.matchInteraction.create).toHaveBeenCalledTimes(1);
  });

  it('resolves reciprocal concurrent-like visibility to matched', async () => {
    const database = databaseFor({ create: { decision: 'like' }, reciprocal: { decision: 'like' } });
    const result = await new PrismaMatchTransitionRepository(database as never).transition(command);
    expect(result).toMatchObject({ state: 'matched', mutual: true, replayed: false });
  });

  it('keeps a one-sided like pending', async () => {
    const database = databaseFor({ create: { decision: 'like' }, reciprocal: null });
    const result = await new PrismaMatchTransitionRepository(database as never).transition(command);
    expect(result).toMatchObject({ state: 'pending', mutual: false });
  });
});

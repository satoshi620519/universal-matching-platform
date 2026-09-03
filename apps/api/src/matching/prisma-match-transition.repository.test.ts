import { describe, expect, it, vi } from 'vitest';
import { PrismaMatchTransitionRepository } from './prisma-match-transition.repository.js';

type Interaction = { decision: 'like' | 'pass'; actorAccountId: string; targetAccountId: string };

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
    return sequence.create ?? { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' };
  });
  const $executeRaw = vi.fn().mockResolvedValue(undefined);
  const notificationCreateMany = vi.fn().mockResolvedValue({ count: 0 });
  const notificationCreate = vi.fn().mockResolvedValueOnce({ id: 'n1', accountId: 'a1' }).mockResolvedValueOnce({ id: 'n2', accountId: 'a2' });
  const tx = { matchInteraction: { findUnique, create }, notification: { create: notificationCreate, createMany: notificationCreateMany }, $executeRaw };
  return {
    $transaction: vi.fn(async (fn: (value: typeof tx) => unknown) => fn(tx)),
    tx,
    notificationRealtime: { publishCreated: vi.fn().mockResolvedValue(undefined) },
  };
}

describe('PrismaMatchTransitionRepository executable transition scenarios', () => {
  const command = { actorAccountId: 'a1', targetAccountId: 'a2', decision: 'like' as const, idempotencyKey: 'k1' };

  it('acquires transaction-scoped pair and idempotency locks with 64-bit hash keys', async () => {
    const database = databaseFor({ create: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: null });
    await new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command);
    expect(database.tx.$executeRaw).toHaveBeenCalledTimes(2);
    expect(database.tx.$executeRaw.mock.calls.every((call) => call.join('').includes('pg_advisory_xact_lock'))).toBe(true);
    expect(database.tx.$executeRaw.mock.calls.every((call) => call.join('').includes('hashtextextended'))).toBe(true);
  });

  it('replays an existing idempotency key without creating a duplicate', async () => {
    const database = databaseFor({ byIdempotency: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: null });
    const result = await new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command);
    expect(result).toMatchObject({ state: 'pending', replayed: true });
    expect(database.tx.matchInteraction.create).not.toHaveBeenCalled();
  });

  it('replays against the persisted interaction pair rather than a conflicting retry target', async () => {
    const database = databaseFor({
      byIdempotency: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' },
      reciprocal: null,
    });
    const conflictingRetry = { ...command, targetAccountId: 'a3' };
    const result = await new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(conflictingRetry);
    expect(result).toMatchObject({ state: 'pending', replayed: true });
    expect(database.tx.matchInteraction.findUnique.mock.calls.at(-1)?.[0]).toMatchObject({
      where: { actorAccountId_targetAccountId: { actorAccountId: 'a2', targetAccountId: 'a1' } },
    });
  });

  it('propagates a unique constraint failure instead of querying an aborted transaction', async () => {
    const uniqueError = Object.assign(new Error('unique'), { code: 'P2002' });
    const database = databaseFor({ create: uniqueError, reciprocal: null });
    await expect(new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command)).rejects.toMatchObject({ code: 'P2002' });
    expect(database.tx.matchInteraction.findUnique).toHaveBeenCalledTimes(1);
  });

  it('resolves reciprocal concurrent-like visibility to matched', async () => {
    const database = databaseFor({ create: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: { decision: 'like', actorAccountId: 'a2', targetAccountId: 'a1' } });
    const result = await new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command);
    expect(result).toMatchObject({ state: 'matched', mutual: true, replayed: false });
  });

  it('keeps a one-sided like pending', async () => {
    const database = databaseFor({ create: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: null });
    const result = await new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command);
    expect(result).toMatchObject({ state: 'pending', mutual: false });
  });

  it('persists one mutual-match notification for each account only on the new matching transition', async () => {
    const database = databaseFor({ create: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: { decision: 'like', actorAccountId: 'a2', targetAccountId: 'a1' } });
    await new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command);
    expect(database.tx.notification.create).toHaveBeenCalledTimes(2);
  });

  it('publishes persisted notification ids only after the transaction succeeds', async () => {
    const database = databaseFor({ create: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: { decision: 'like', actorAccountId: 'a2', targetAccountId: 'a1' } });
    await new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command);
    expect(database.notificationRealtime.publishCreated).toHaveBeenCalledWith({ notificationIds: ['n1', 'n2'], recipientAccountIds: ['a1', 'a2'] });
  });

  it('does not turn a successful match into a failure when realtime publication fails', async () => {
    const database = databaseFor({ create: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: { decision: 'like', actorAccountId: 'a2', targetAccountId: 'a1' } });
    database.notificationRealtime.publishCreated.mockRejectedValueOnce(new Error('offline'));
    await expect(new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command)).resolves.toMatchObject({ state: 'matched' });
  });

  it('does not create notifications for an idempotency replay', async () => {
    const database = databaseFor({ byIdempotency: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: { decision: 'like', actorAccountId: 'a2', targetAccountId: 'a1' } });
    await new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never).transition(command);
    expect(database.tx.notification.createMany).not.toHaveBeenCalled();
  });

  it('observes a newly applied safety restriction on the next transition immediately', async () => {
    const database = databaseFor({ create: { decision: 'like', actorAccountId: 'a1', targetAccountId: 'a2' }, reciprocal: null });
    let restriction: 'none' | 'feature-restricted' = 'none';
    const safety = { resolveForAccount: vi.fn(async () => restriction) };
    const repository = new PrismaMatchTransitionRepository(database as never, database.notificationRealtime as never, safety as never);

    await repository.transition(command);
    restriction = 'feature-restricted';

    await expect(repository.transition({ ...command, idempotencyKey: 'after-restriction' })).rejects.toThrow('account is restricted from matching');
    expect(safety.resolveForAccount).toHaveBeenCalledWith('a1', 'general');
    expect(safety.resolveForAccount).toHaveBeenCalledWith('a2', 'general');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { PrismaConversationRepository } from './prisma-conversation.repository.js';

const conversation = (id: string) => ({
  id,
  createdAt: new Date(),
  participants: [
    { accountId: 'a-account', joinedAt: new Date() },
    { accountId: 'z-account', joinedAt: new Date() },
  ],
});

describe('PrismaConversationRepository', () => {
  it('uses a canonical sorted pair and returns an existing direct conversation', async () => {
    const existing = conversation('c-existing');
    const findMany = vi.fn().mockResolvedValue([
      { conversation: existing },
    ]);
    const repository = new PrismaConversationRepository({
      conversationParticipant: { findMany },
    } as never);

    await expect(repository.createOrFindDirect('z-account', 'a-account')).resolves.toEqual(existing);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { accountId: 'a-account' } }));
  });

  it('creates a direct conversation when no participant pair exists', async () => {
    const create = vi.fn().mockResolvedValue(conversation('c-new'));
    const database = {
      conversationParticipant: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn(async (fn: (tx: unknown) => unknown) => fn({
        conversationParticipant: { findMany: vi.fn().mockResolvedValue([]) },
        conversation: { create },
        $executeRawUnsafe: vi.fn().mockResolvedValue(0),
      })),
    };
    const repository = new PrismaConversationRepository(database as never);

    await expect(repository.createOrFindDirect('a1', 'a2')).resolves.toEqual(expect.objectContaining({ id: 'c-new' }));
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      data: { participants: { create: [{ accountId: 'a1' }, { accountId: 'a2' }] } },
    }));
  });

  it('serializes direct conversation creation with a PostgreSQL advisory lock', async () => {
    const executeRaw = vi.fn().mockResolvedValue(0);
    const database = {
      conversationParticipant: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn(async (fn: (tx: unknown) => unknown) => fn({
        conversationParticipant: { findMany: vi.fn().mockResolvedValue([]) },
        conversation: { create: vi.fn().mockResolvedValue(conversation('c-new')) },
        $executeRawUnsafe: executeRaw,
      })),
    };
    const repository = new PrismaConversationRepository(database as never);

    await repository.createOrFindDirect('z-account', 'a-account');
    expect(executeRaw).toHaveBeenCalledWith(
      'SELECT pg_advisory_xact_lock(hashtextextended($1, 0))',
      'direct-conversation:a-account:z-account',
    );
  });

  it('records analytics only when a new direct conversation is created', async () => {
    const recordBusinessEvent = vi.fn().mockResolvedValue(undefined);
    const database = {
      conversationParticipant: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn(async (fn: (tx: unknown) => unknown) => fn({
        conversationParticipant: { findMany: vi.fn().mockResolvedValue([]) },
        conversation: { create: vi.fn().mockResolvedValue(conversation('c-new')) },
        $executeRawUnsafe: vi.fn().mockResolvedValue(0),
      })),
    };
    const repository = new PrismaConversationRepository(database as never, { recordBusinessEvent } as any);

    await repository.createOrFindDirect('a1', 'a2');
    expect(recordBusinessEvent).toHaveBeenCalledWith('conversation_started');
  });

  it('creates one participant record per distinct account', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'c1', createdAt: new Date(), participants: [] });
    const repository = new PrismaConversationRepository({ conversation: { create } } as never);
    await repository.create(['a1', 'a2', 'a1']);
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      data: { participants: { create: [{ accountId: 'a1' }, { accountId: 'a2' }] } },
    }));
  });

  it('rejects a conversation with fewer than two distinct participants', async () => {
    const repository = new PrismaConversationRepository({} as never);
    await expect(repository.create(['a1', 'a1'])).rejects.toThrow('at least two distinct participants');
  });

  it('returns a conversation only through participant access', async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const repository = new PrismaConversationRepository({ conversationParticipant: { findUnique } } as never);
    await expect(repository.findForParticipant('c1', 'a1')).resolves.toBeNull();
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({
      where: { conversationId_accountId: { conversationId: 'c1', accountId: 'a1' } },
    }));
  });
});

describe('analytics conversation metric boundary', () => {
  it('records conversation_started only for a newly created direct conversation', async () => {
    const analytics = { recordBusinessEvent: vi.fn().mockResolvedValue(undefined) } as any;
    const database = {
      conversationParticipant: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn(async (fn: (tx: unknown) => unknown) => fn({
        conversationParticipant: { findMany: vi.fn().mockResolvedValue([]) },
        conversation: { create: vi.fn().mockResolvedValue(conversation('c-new')) },
        $executeRawUnsafe: vi.fn().mockResolvedValue(0),
      })),
    };
    const repository = new PrismaConversationRepository(database as any, analytics);

    await repository.createOrFindDirect('a1', 'a2');
    expect(analytics.recordBusinessEvent).toHaveBeenCalledWith('conversation_started');
  });
});

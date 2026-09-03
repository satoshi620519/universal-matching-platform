import { describe, expect, it, vi } from 'vitest';
import { PrismaConversationRepository } from './prisma-conversation.repository.js';

describe('PrismaConversationRepository', () => {
  it('uses a canonical sorted pair and returns an existing direct conversation', async () => {
    const findUnique = vi.fn().mockResolvedValue({ conversation: { id:'c-existing', participants: [] } });
    const repository = new PrismaConversationRepository({ directConversationPair: { findUnique } } as never);
    await expect(repository.createOrFindDirect('z-account','a-account')).resolves.toEqual(expect.objectContaining({ id:'c-existing' }));
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { accountLowId_accountHighId: { accountLowId:'a-account', accountHighId:'z-account' } } }));
  });

  it('recovers outside an aborted transaction when a concurrent pair insert wins', async () => {
    const conflict = Object.assign(new Error('unique'), { code: 'P2002' });
    const winner = { conversation: { id: 'c-winner', participants: [] } };
    const directConversationPair = {
      findUnique: vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(winner),
    };
    const database = {
      directConversationPair,
      $transaction: vi.fn(async (fn: (tx: unknown) => unknown) => {
        await fn({ directConversationPair: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn() }, conversation: { create: vi.fn() } });
        throw conflict;
      }),
    };
    const repository = new PrismaConversationRepository(database as never);
    await expect(repository.createOrFindDirect('a1', 'a2')).resolves.toEqual(winner.conversation);
    expect(directConversationPair.findUnique).toHaveBeenCalledTimes(2);
  });

  it('does not mask a unique conflict when no winning pair can be found', async () => {
    const conflict = Object.assign(new Error('unique'), { code: 'P2002' });
    const directConversationPair = { findUnique: vi.fn().mockResolvedValue(null) };
    const database = {
      directConversationPair,
      $transaction: vi.fn(async (fn: () => unknown) => {
        await fn({ directConversationPair: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn() }, conversation: { create: vi.fn() } });
        throw conflict;
      }),
    };
    const repository = new PrismaConversationRepository(database as never);
    await expect(repository.createOrFindDirect('a1', 'a2')).rejects.toBe(conflict);
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

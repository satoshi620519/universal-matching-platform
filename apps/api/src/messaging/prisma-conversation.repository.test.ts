import { describe, expect, it, vi } from 'vitest';
import { PrismaConversationRepository } from './prisma-conversation.repository.js';

describe('PrismaConversationRepository', () => {
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

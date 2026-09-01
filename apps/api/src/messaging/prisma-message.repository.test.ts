import { describe, expect, it, vi } from 'vitest';
import { PrismaMessageRepository } from './prisma-message.repository.js';

describe('PrismaMessageRepository', () => {
  it('does not create a message when sender is not a participant', async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const create = vi.fn();
    const repository = new PrismaMessageRepository({
      $transaction: (operation: (tx: unknown) => unknown) => operation({ conversationParticipant: { findUnique }, message: { create } }),
    } as never);

    await expect(repository.createForParticipant({ conversationId: 'c1', senderAccountId: 'a1', body: 'hello' })).resolves.toBeNull();
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects an empty message body', async () => {
    const repository = new PrismaMessageRepository({} as never);
    await expect(repository.createForParticipant({ conversationId: 'c1', senderAccountId: 'a1', body: '   ' })).rejects.toThrow('must not be empty');
  });
  it('does not expose messages when reader is not a participant', async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const findMany = vi.fn();
    const repository = new PrismaMessageRepository({ conversationParticipant: { findUnique }, message: { findMany } } as never);
    await expect(repository.listForParticipant({ conversationId: 'c1', accountId: 'a1' })).resolves.toBeNull();
    expect(findMany).not.toHaveBeenCalled();
  });

  it('bounds message reads and orders newest first', async () => {
    const findUnique = vi.fn().mockResolvedValue({ accountId: 'a1' });
    const findMany = vi.fn().mockResolvedValue([]);
    const repository = new PrismaMessageRepository({ conversationParticipant: { findUnique }, message: { findMany } } as never);
    await repository.listForParticipant({ conversationId: 'c1', accountId: 'a1', limit: 500 });
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }));
  });

});

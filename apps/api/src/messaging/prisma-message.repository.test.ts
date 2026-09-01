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
});

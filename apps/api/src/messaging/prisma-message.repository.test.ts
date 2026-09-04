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

  it('creates recipient notifications in the same message transaction', async () => {
    const findUnique = vi.fn().mockResolvedValue({ accountId: 'a1' });
    const create = vi.fn().mockResolvedValue({ id: 'm1', conversationId: 'c1', senderAccountId: 'a1', body: 'hello' });
    const findMany = vi.fn().mockResolvedValue([{ accountId: 'a2' }, { accountId: 'a3' }]);
    const createMany = vi.fn().mockResolvedValue({ count: 2 });
    const repository = new PrismaMessageRepository({
      $transaction: (operation: (tx: unknown) => unknown) => operation({
        conversationParticipant: { findUnique, findMany },
        message: { create },
        notification: { createMany },
      }),
    } as never);

    await repository.createForParticipant({ conversationId: 'c1', senderAccountId: 'a1', body: 'hello' });

    expect(createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ accountId: 'a2', kind: 'message.created' }),
        expect.objectContaining({ accountId: 'a3', kind: 'message.created' }),
      ]),
    });
  });
  it('marks read state only for an authorized participant row', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const repository = new PrismaMessageRepository({ conversationParticipant: { updateMany } } as never);
    await expect(repository.markReadForParticipant({ conversationId:'c1', accountId:'a1', at:new Date('2026-01-01T00:00:00Z') })).resolves.toBe(true);
    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({ where:{ conversationId:'c1', accountId:'a1' } }));
  });

  it('soft deletes only the authenticated sender message once', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const repository = new PrismaMessageRepository({ message: { updateMany } } as never);
    await expect(repository.softDeleteForSender({ messageId:'m1', senderAccountId:'a1' })).resolves.toBe(true);
    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ id:'m1', senderAccountId:'a1', deletedAt:null }) }));
  });
});

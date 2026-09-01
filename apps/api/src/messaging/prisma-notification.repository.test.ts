import { describe, expect, it, vi } from 'vitest';
import { PrismaNotificationRepository } from './prisma-notification.repository.js';

describe('PrismaNotificationRepository', () => {
  it('scopes reads to the authenticated account boundary', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const repository = new PrismaNotificationRepository({ notification: { findMany } } as never);
    await repository.listForAccount('a1', 500);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { accountId: 'a1' }, take: 100 }));
  });

  it('marks read only for the owning account', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 0 });
    const repository = new PrismaNotificationRepository({ notification: { updateMany } } as never);
    await expect(repository.markReadForAccount('n1', 'a1')).resolves.toBe(false);
    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'n1', accountId: 'a1', readAt: null } }));
  });
});

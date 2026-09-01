import { describe, expect, it, vi } from 'vitest';

import { AdministrativeFailedEmailOutboxController } from './administrative-failed-email-outbox.controller.js';

describe('AdministrativeFailedEmailOutboxController', () => {
  it('resolves the authenticated principal before invoking the privileged list boundary', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({ accountId: 'moderator-1' });
    const list = vi.fn().mockResolvedValue([]);
    const controller = new AdministrativeFailedEmailOutboxController(
      { requireAuthenticated } as any,
      { list } as any,
    );

    await controller.list('10', 'Bearer opaque', 'request-1');

    expect(requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer opaque', requestId: 'request-1',
    });
    expect(list).toHaveBeenCalledWith('moderator-1', 10, 'request-1');
  });

  it('rejects invalid bounded limits before outbox access', async () => {
    const controller = new AdministrativeFailedEmailOutboxController(
      { requireAuthenticated: vi.fn() } as any,
      { list: vi.fn() } as any,
    );

    await expect(controller.list('101', undefined, undefined)).rejects.toThrow(
      'limit must be an integer between 1 and 100',
    );
  });

  it('passes only the principal identity and target id to the privileged requeue boundary', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({ accountId: 'moderator-1' });
    const requeue = vi.fn().mockResolvedValue(true);
    const controller = new AdministrativeFailedEmailOutboxController(
      { requireAuthenticated } as any,
      { requeue } as any,
    );

    await expect(controller.requeue('outbox-1', 'Bearer opaque', 'request-2')).resolves.toEqual({ requeued: true });
    expect(requeue).toHaveBeenCalledWith('moderator-1', 'outbox-1', 'request-2');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { MessagingController } from './messaging.controller.js';

describe('MessagingController notifications', () => {
  const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'a1' }) };

  it('scopes notification reads to the authenticated account', async () => {
    const listForAccount = vi.fn().mockResolvedValue([]);
    const controller = new MessagingController(principalResolver as never, {} as never, {} as never, { listForAccount } as never);
    await controller.listNotifications();
    expect(listForAccount).toHaveBeenCalledWith('a1');
  });

  it('scopes notification acknowledgement to the authenticated account', async () => {
    const markReadForAccount = vi.fn().mockResolvedValue(false);
    const controller = new MessagingController(principalResolver as never, {} as never, {} as never, { markReadForAccount } as never);
    await expect(controller.markNotificationRead('n1')).resolves.toEqual({ statusCode: 404 });
    expect(markReadForAccount).toHaveBeenCalledWith('n1', 'a1');
  });
});

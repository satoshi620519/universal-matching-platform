import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MessagingController } from './messaging.controller.js';

describe('MessagingController notifications', () => {
  beforeEach(() => vi.clearAllMocks());
  const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'a1' }) };

  it('scopes notification reads to the authenticated account', async () => {
    const listForAccount = vi.fn().mockResolvedValue([]);
    const controller = new MessagingController(principalResolver as never, {} as never, {} as never, { listForAccount } as never, { publishRecipients: vi.fn() } as never, {} as never);
    await controller.listNotifications();
    expect(listForAccount).toHaveBeenCalledWith('a1');
  });

  it('scopes notification acknowledgement to the authenticated account', async () => {
    const markReadForAccount = vi.fn().mockResolvedValue(false);
    const controller = new MessagingController(principalResolver as never, {} as never, {} as never, { markReadForAccount } as never, { publishRecipients: vi.fn() } as never, {} as never);
    await expect(controller.markNotificationRead('n1')).resolves.toEqual({ statusCode: 404 });
    expect(markReadForAccount).toHaveBeenCalledWith('n1', 'a1');
  });

  it('clamps repository-owned notification lists and does not expose cross-account reads', async () => {
    const listForAccount = vi.fn().mockResolvedValue([{ id: 'n1', accountId: 'a1', kind: 'message.created', payload: {}, createdAt: new Date(), readAt: null }]);
    const controller = new MessagingController(principalResolver as never, {} as never, {} as never, { listForAccount } as never, { publishRecipients: vi.fn() } as never, {} as never);
    await expect(controller.listNotifications()).resolves.toEqual(expect.objectContaining({ notifications: expect.any(Array) }));
    expect(listForAccount).toHaveBeenCalledTimes(1);
    expect(listForAccount).toHaveBeenCalledWith('a1');
  });

  it('recovers a notification through the API even when its realtime event was missed', async () => {
    const persisted = { id: 'n1', accountId: 'a1', kind: 'message.created', payload: { messageId: 'm1' }, createdAt: new Date(), readAt: null };
    const listForAccount = vi.fn().mockResolvedValue([persisted]);
    const publishRecipients = vi.fn().mockRejectedValue(new Error('client was disconnected'));
    const controller = new MessagingController(principalResolver as never, {} as never, {} as never, { listForAccount } as never, { publishRecipients } as never, {} as never);

    await expect(controller.listNotifications()).resolves.toEqual({ notifications: [persisted] });
    expect(listForAccount).toHaveBeenCalledWith('a1');
    expect(publishRecipients).not.toHaveBeenCalled();
  });
});

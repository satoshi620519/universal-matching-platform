import { describe, expect, it, vi } from 'vitest';
import { MessagingController } from '../messaging/messaging.controller.js';

describe('Realtime reconnect reconciliation contract', () => {
  it('can recover messages from the authoritative HTTP read after an SSE disconnect', async () => {
    const listForParticipant = vi.fn().mockResolvedValue([{ id: 'm1' }]);
    const controller = new MessagingController(
      { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'a1' }) } as never,
      {} as never,
      { listForParticipant } as never,
      {} as never,
      {} as never,
    );

    // The SSE stream is intentionally transient; reconciliation re-reads durable state.
    const response = await controller.listMessages('c1');

    expect(response).toEqual({ messages: [{ id: 'm1' }] });
    expect(listForParticipant).toHaveBeenCalledWith({ conversationId: 'c1', accountId: 'a1' });
  });

  it('does not require a realtime publisher to recover notifications', async () => {
    const listForAccount = vi.fn().mockResolvedValue([{ id: 'n1' }]);
    const controller = new MessagingController(
      { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'a1' }) } as never,
      {} as never,
      {} as never,
      { listForAccount } as never,
      {} as never,
    );

    await expect(controller.listNotifications()).resolves.toEqual({ notifications: [{ id: 'n1' }] });
    expect(listForAccount).toHaveBeenCalledWith('a1');
  });
});

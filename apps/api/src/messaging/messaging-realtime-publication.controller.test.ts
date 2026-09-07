import { describe, expect, it, vi } from 'vitest';
import { MessagingController } from './messaging.controller.js';
describe('MessagingController post-commit publication', () => {
  const matches = {} as never;

  it('publishes only after createForParticipant returns a committed result', async () => {
    const publishRecipients = vi.fn().mockResolvedValue(undefined);
    const controller = new MessagingController({ requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'a1' }) } as never, { findForParticipant: vi.fn().mockResolvedValue({ participants: [{ accountId: 'a1' }, { accountId: 'a2' }] }) } as never, { createForParticipant: vi.fn().mockResolvedValue({ message: { id: 'm1', conversationId: 'c1', senderAccountId: 'a1' }, recipientAccountIds: ['a2'], notificationIds: [] }) } as never, {} as never, { publishRecipients } as never, {} as never, matches);
    await controller.createMessage('c1', { body: 'hello' });
    expect(publishRecipients).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'm1', recipientAccountIds: ['a2'] }));
  });
  it('does not publish when createForParticipant returns null', async () => {
    const publishRecipients = vi.fn();
    const controller = new MessagingController({ requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'a1' }) } as never, { findForParticipant: vi.fn().mockResolvedValue({ participants: [{ accountId: 'a1' }, { accountId: 'a2' }] }) } as never, { createForParticipant: vi.fn().mockResolvedValue(null) } as never, {} as never, { publishRecipients } as never, {} as never, matches);
    await controller.createMessage('c1', { body: 'hello' });
    expect(publishRecipients).not.toHaveBeenCalled();
  });
});
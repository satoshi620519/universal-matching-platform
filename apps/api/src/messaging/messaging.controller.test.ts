import { describe, expect, it, vi } from 'vitest';
import { MessagingController } from './messaging.controller.js';

describe('MessagingController', () => {
  const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'a1' }) };
  const matches = {} as never;

  it('always adds the authenticated account when creating a conversation', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'c1' });
    const controller = new MessagingController(principalResolver as never, { create } as never, {} as never, {} as never, { publishRecipients: vi.fn() } as never, {} as never, matches);
    await controller.createConversation({ participantAccountIds: ['a2'] });
    expect(create).toHaveBeenCalledWith(['a2', 'a1']);
  });

  it('creates mutual-match conversations through the idempotent direct-pair path', async () => {
    const createOrFindDirect = vi.fn().mockResolvedValue({ id:'c1' });
    const matchRepository = { isMutualMatch: vi.fn().mockResolvedValue(true) };
    const controller = new MessagingController(principalResolver as never, { createOrFindDirect } as never, {} as never, {} as never, { publishRecipients: vi.fn() } as never, {} as never, matchRepository as never);
    await controller.createConversationFromMutualMatch({ targetAccountId:'a2' });
    expect(createOrFindDirect).toHaveBeenCalledWith('a1','a2');
  });

  it('uses the authenticated account for message writes', async () => {
    const createForParticipant = vi.fn().mockResolvedValue({ message: { id: 'm1', conversationId: 'c1', senderAccountId: 'a1' }, recipientAccountIds: ['a2'], notificationIds: [] });
    const conversations = { findForParticipant: vi.fn().mockResolvedValue({ participants: [{ accountId: 'a1' }, { accountId: 'a2' }] }) };
    const controller = new MessagingController(principalResolver as never, conversations as never, { createForParticipant } as never, {} as never, { publishRecipients: vi.fn() } as never, {} as never, matches);
    await controller.createMessage('c1', { body: 'hello' });
    expect(createForParticipant).toHaveBeenCalledWith({ conversationId: 'c1', senderAccountId: 'a1', body: 'hello' });
  });

  it('blocks messages in an existing conversation after either participant blocks the other', async () => {
    const createForParticipant = vi.fn();
    const conversations = { findForParticipant: vi.fn().mockResolvedValue({ participants: [{ accountId: 'a1' }, { accountId: 'a2' }] }) };
    const blocks = { exists: vi.fn(async (blocker: string, blocked: string) => blocker === 'a2' && blocked === 'a1') };
    const controller = new MessagingController(principalResolver as never, conversations as never, { createForParticipant } as never, {} as never, { publishRecipients: vi.fn() } as never, {} as never, matches, undefined, blocks as never);
    await expect(controller.createMessage('c1', { body: 'blocked' })).rejects.toThrow('communication is blocked between these accounts');
    expect(createForParticipant).not.toHaveBeenCalled();
  });

  it('observes a newly applied communication restriction on the next message immediately', async () => {
    const createForParticipant = vi.fn().mockResolvedValue({ message: { id: 'm1', conversationId: 'c1', senderAccountId: 'a1' }, recipientAccountIds: ['a2'], notificationIds: [] });
    const conversations = { findForParticipant: vi.fn().mockResolvedValue({ participants: [{ accountId: 'a1' }, { accountId: 'a2' }] }) };
    let restriction: 'none' | 'communication-restricted' = 'none';
    const safety = { resolveForAccount: vi.fn(async () => restriction) };
    const controller = new MessagingController(principalResolver as never, conversations as never, { createForParticipant } as never, {} as never, { publishRecipients: vi.fn() } as never, {} as never, matches, safety as never);

    await controller.createMessage('c1', { body: 'before restriction' });
    restriction = 'communication-restricted';

    await expect(controller.createMessage('c1', { body: 'after restriction' })).rejects.toThrow('account is restricted from communication');
    expect(createForParticipant).toHaveBeenCalledTimes(1);
    expect(safety.resolveForAccount).toHaveBeenCalledWith('a1', 'communication');
  });
  it('uses authenticated participant identity for read state', async () => {
    const markReadForParticipant = vi.fn().mockResolvedValue(true);
    const controller = new MessagingController(principalResolver as never, {} as never, { markReadForParticipant } as never, {} as never, { publishRecipients: vi.fn() } as never, {} as never, matches);
    await controller.markConversationRead('c1');
    expect(markReadForParticipant).toHaveBeenCalledWith({ conversationId:'c1', accountId:'a1' });
  });

  it('allows deletion only through authenticated sender identity', async () => {
    const softDeleteForSender = vi.fn().mockResolvedValue(true);
    const controller = new MessagingController(principalResolver as never, {} as never, { softDeleteForSender } as never, {} as never, { publishRecipients: vi.fn() } as never, {} as never, matches);
    await controller.deleteMessage('c1','m1');
    expect(softDeleteForSender).toHaveBeenCalledWith({ messageId:'m1', senderAccountId:'a1' });
  });

  it('lists unread notifications only for the authenticated account', async () => {
    const notifications = { listUnreadForAccount: vi.fn().mockResolvedValue([{ id: 'n1' }]) };
    const controller = new MessagingController(principalResolver as never, {} as never, {} as never, notifications as never, {} as never, {} as never, matches);
    await expect(controller.listUnreadNotifications()).resolves.toEqual({ notifications: [{ id: 'n1' }] });
    expect(notifications.listUnreadForAccount).toHaveBeenCalledWith('a1');
  });
});
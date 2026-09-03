import { describe, expect, it, vi } from 'vitest';
import { MessagingController } from './messaging.controller.js';

describe('MessagingController', () => {
  const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'a1' }) };

  it('always adds the authenticated account when creating a conversation', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'c1' });
    const controller = new MessagingController(principalResolver as never, { create } as never, {} as never, {} as never, { publishRecipients: vi.fn() } as never, {} as never);
    await controller.createConversation({ participantAccountIds: ['a2'] });
    expect(create).toHaveBeenCalledWith(['a2', 'a1']);
  });

  it('creates mutual-match conversations through the idempotent direct-pair path', async () => {
    const createOrFindDirect = vi.fn().mockResolvedValue({ id:'c1' });
    const matches = { isMutualMatch: vi.fn().mockResolvedValue(true) };
    const controller = new MessagingController(principalResolver as never, { createOrFindDirect } as never, {} as never, {} as never, { publishRecipients: vi.fn() } as never, matches as never);
    await controller.createConversationFromMutualMatch({ targetAccountId:'a2' });
    expect(createOrFindDirect).toHaveBeenCalledWith('a1','a2');
  });

  it('uses the authenticated account for message writes', async () => {
    const createForParticipant = vi.fn().mockResolvedValue({ message: { id: 'm1', conversationId: 'c1', senderAccountId: 'a1' }, recipientAccountIds: ['a2'] });
    const controller = new MessagingController(principalResolver as never, {} as never, { createForParticipant } as never, {} as never, { publishRecipients: vi.fn() } as never);
    await controller.createMessage('c1', { body: 'hello' });
    expect(createForParticipant).toHaveBeenCalledWith({ conversationId: 'c1', senderAccountId: 'a1', body: 'hello' });
  });
});

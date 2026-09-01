import { describe, expect, it } from 'vitest';
import { createConversation, createConversationParticipant } from './conversation.js';

describe('conversation domain', () => {
  it('creates a conversation with a normalized instant', () => {
    expect(createConversation({ id: 'conversation-1', createdAt: '2026-01-01T00:00:00Z' })).toEqual({
      id: 'conversation-1',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('rejects invalid participant identity boundaries', () => {
    expect(() => createConversationParticipant({ conversationId: '', accountId: 'account-1', joinedAt: '2026-01-01T00:00:00Z' })).toThrow();
    expect(() => createConversationParticipant({ conversationId: 'conversation-1', accountId: '', joinedAt: '2026-01-01T00:00:00Z' })).toThrow();
  });
});

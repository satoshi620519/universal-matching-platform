import { DomainError } from './index.js';

export type Conversation = {
  id: string;
  createdAt: string;
};

export type ConversationParticipant = {
  conversationId: string;
  accountId: string;
  joinedAt: string;
};

export function createConversation(input: { id: string; createdAt: string }): Conversation {
  if (!input.id.trim()) throw new DomainError('conversation.id.invalid', 'Conversation id must not be empty');
  const createdAt = new Date(input.createdAt);
  if (Number.isNaN(createdAt.getTime())) throw new DomainError('conversation.createdAt.invalid', 'Conversation createdAt must be an instant');
  return { id: input.id, createdAt: createdAt.toISOString() };
}

export function createConversationParticipant(input: {
  conversationId: string;
  accountId: string;
  joinedAt: string;
}): ConversationParticipant {
  if (!input.conversationId.trim()) throw new DomainError('conversationParticipant.conversationId.invalid', 'Conversation id must not be empty');
  if (!input.accountId.trim()) throw new DomainError('conversationParticipant.accountId.invalid', 'Account id must not be empty');
  const joinedAt = new Date(input.joinedAt);
  if (Number.isNaN(joinedAt.getTime())) throw new DomainError('conversationParticipant.joinedAt.invalid', 'Conversation participant joinedAt must be an instant');
  return { ...input, joinedAt: joinedAt.toISOString() };
}

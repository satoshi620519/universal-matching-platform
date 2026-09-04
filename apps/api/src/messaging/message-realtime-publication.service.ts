import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RealtimePublisher } from '../realtime/realtime-publisher.js';

@Injectable()
export class MessageRealtimePublicationService {
  constructor(private readonly realtime: RealtimePublisher) {}

  async publishRecipients(input: {
    messageId: string;
    conversationId: string;
    senderAccountId: string;
    recipientAccountIds: string[];
  }): Promise<void> {
    await Promise.all(input.recipientAccountIds.map((accountId) =>
      this.realtime.publishToAccount(accountId, {
        eventId: randomUUID(),
        eventType: 'message.created',
        schemaVersion: 1,
        occurredAt: new Date().toISOString(),
        resource: { type: 'message', id: input.messageId },
        payload: {
          conversationId: input.conversationId,
          messageId: input.messageId,
          senderAccountId: input.senderAccountId,
        },
      }),
    ));

  async publishTyping(input: { conversationId: string; senderAccountId: string; recipientAccountIds: string[]; isTyping: boolean }): Promise<void> {
    await Promise.all(input.recipientAccountIds.map((accountId) => this.realtime.publishToAccount(accountId, {
      eventId: randomUUID(),
      eventType: 'conversation.typing',
      schemaVersion: 1,
      occurredAt: new Date().toISOString(),
      resource: { type: 'conversation', id: input.conversationId },
      payload: { conversationId: input.conversationId, senderAccountId: input.senderAccountId, isTyping: input.isTyping },
    })));
  }
}

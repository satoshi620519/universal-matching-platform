import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export type MessageRecord = {
  id: string;
  conversationId: string;
  senderAccountId: string;
  body: string;
  createdAt: Date;
};

@Injectable()
export class PrismaMessageRepository {
  constructor(private readonly database: DatabaseService) {}

  async createForParticipant(input: {
    conversationId: string;
    senderAccountId: string;
    body: string;
  }): Promise<MessageRecord | null> {
    const body = input.body.trim();
    if (!body) throw new Error('Message body must not be empty');

    return this.database.$transaction(async (tx) => {
      const participant = await tx.conversationParticipant.findUnique({
        where: {
          conversationId_accountId: {
            conversationId: input.conversationId,
            accountId: input.senderAccountId,
          },
        },
        select: { accountId: true },
      });
      if (!participant) return null;

      return tx.message.create({
        data: {
          conversationId: input.conversationId,
          senderAccountId: input.senderAccountId,
          body,
        },
      });
    });
  }
}

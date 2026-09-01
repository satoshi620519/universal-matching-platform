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

  async listForParticipant(input: {
    conversationId: string;
    accountId: string;
    limit?: number;
    before?: { createdAt: Date; id: string };
  }): Promise<MessageRecord[] | null> {
    const participant = await this.database.conversationParticipant.findUnique({
      where: {
        conversationId_accountId: {
          conversationId: input.conversationId,
          accountId: input.accountId,
        },
      },
      select: { accountId: true },
    });
    if (!participant) return null;

    const limit = Math.min(Math.max(input.limit ?? 50, 1), 100);
    return this.database.message.findMany({
      where: {
        conversationId: input.conversationId,
        ...(input.before
          ? {
              OR: [
                { createdAt: { lt: input.before.createdAt } },
                { createdAt: input.before.createdAt, id: { lt: input.before.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
    });
  }
}

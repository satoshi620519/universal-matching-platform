import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export type CreatedMessage = { message: MessageRecord; recipientAccountIds: string[]; };

export type MessageRecord = {
  id: string;
  conversationId: string;
  senderAccountId: string;
  body: string;
  createdAt: Date;
  deletedAt?: Date | null;
};

@Injectable()
export class PrismaMessageRepository {
  constructor(private readonly database: DatabaseService) {}

  async createForParticipant(input: {
    conversationId: string;
    senderAccountId: string;
    body: string;
  }): Promise<CreatedMessage | null> {
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

      const message = await tx.message.create({
        data: {
          conversationId: input.conversationId,
          senderAccountId: input.senderAccountId,
          body,
        },
      });

      const recipients = await tx.conversationParticipant.findMany({
        where: {
          conversationId: input.conversationId,
          accountId: { not: input.senderAccountId },
        },
        select: { accountId: true },
      });

      if (recipients.length > 0) {
        await tx.notification.createMany({
          data: recipients.map(({ accountId }) => ({
            accountId,
            kind: 'message.created',
            payload: {
              conversationId: message.conversationId,
              messageId: message.id,
              senderAccountId: message.senderAccountId,
            },
          })),
        });
      }

      return { message, recipientAccountIds: recipients.map(({ accountId }) => accountId) };
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

  async markReadForParticipant(input: { conversationId: string; accountId: string; at?: Date }): Promise<boolean> {
    const updated = await this.database.conversationParticipant.updateMany({
      where: { conversationId: input.conversationId, accountId: input.accountId },
      data: { lastReadAt: input.at ?? new Date() },
    });
    return updated.count === 1;
  }

  async softDeleteForSender(input: { messageId: string; senderAccountId: string; at?: Date }): Promise<boolean> {
    const updated = await this.database.message.updateMany({
      where: { id: input.messageId, senderAccountId: input.senderAccountId, deletedAt: null },
      data: { deletedAt: input.at ?? new Date() },
    });
    return updated.count === 1;
  }

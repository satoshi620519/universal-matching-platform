import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export type ConversationRecord = {
  id: string;
  createdAt: Date;
  participants: Array<{ accountId: string; joinedAt: Date }>;
};

@Injectable()
export class PrismaConversationRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(participantAccountIds: string[]): Promise<ConversationRecord> {
    const accountIds = [...new Set(participantAccountIds.map((value) => value.trim()).filter(Boolean))];
    if (accountIds.length < 2) throw new Error('A conversation requires at least two distinct participants');
    return this.database.conversation.create({
      data: { participants: { create: accountIds.map((accountId) => ({ accountId })) } },
      include: { participants: { orderBy: { joinedAt: 'asc' } } },
    });
  }

  async findForParticipant(conversationId: string, accountId: string): Promise<ConversationRecord | null> {
    const participant = await this.database.conversationParticipant.findUnique({
      where: { conversationId_accountId: { conversationId, accountId } },
      select: { conversation: { include: { participants: { orderBy: { joinedAt: 'asc' } } } } },
    });
    return participant?.conversation ?? null;
  }
}

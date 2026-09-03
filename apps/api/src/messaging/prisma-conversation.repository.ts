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

  async createOrFindDirect(accountA: string, accountB: string): Promise<ConversationRecord> {
    const [low, high] = [accountA.trim(), accountB.trim()].sort();
    if (!low || !high || low === high) throw new Error('A direct conversation requires two distinct participants');
    const existing = await this.database.directConversationPair.findUnique({
      where: { accountLowId_accountHighId: { accountLowId: low, accountHighId: high } },
      include: { conversation: { include: { participants: { orderBy: { joinedAt: 'asc' } } } } },
    });
    if (existing) return existing.conversation;
    try {
      return await this.database.$transaction(async (tx) => {
        const raced = await tx.directConversationPair.findUnique({ where: { accountLowId_accountHighId: { accountLowId: low, accountHighId: high } }, include: { conversation: { include: { participants: { orderBy: { joinedAt: 'asc' } } } } } });
        if (raced) return raced.conversation;
        const conversation = await tx.conversation.create({ data: { participants: { create: [{ accountId: low }, { accountId: high }] } }, include: { participants: { orderBy: { joinedAt: 'asc' } } } });
        await tx.directConversationPair.create({ data: { accountLowId: low, accountHighId: high, conversationId: conversation.id } });
        return conversation;
      });
    } catch (error) {
      if (!this.isUniqueConflict(error)) throw error;
      const winner = await this.database.directConversationPair.findUnique({
        where: { accountLowId_accountHighId: { accountLowId: low, accountHighId: high } },
        include: { conversation: { include: { participants: { orderBy: { joinedAt: 'asc' } } } } },
      });
      if (winner) return winner.conversation;
      throw error;
    }
  }

  private isUniqueConflict(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: unknown }).code === 'P2002';
  }

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

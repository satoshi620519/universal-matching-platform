import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { AnalyticsEventRecordingService } from '../analytics/analytics-event-recording.service.js';

export type ConversationRecord = {
  id: string;
  createdAt: Date;
  participants: Array<{ accountId: string; joinedAt: Date }>;
};

@Injectable()
export class PrismaConversationRepository {
  constructor(private readonly database: DatabaseService, private readonly analytics?: AnalyticsEventRecordingService) {}

  async findDirect(accountA: string, accountB: string): Promise<ConversationRecord | null> {
    const [low, high] = [accountA.trim(), accountB.trim()].sort();
    if (!low || !high || low === high) return null;
    return this.findDirectByParticipants(this.database, low, high);
  }

  async createOrFindDirect(accountA: string, accountB: string): Promise<ConversationRecord> {
    const [low, high] = [accountA.trim(), accountB.trim()].sort();
    if (!low || !high || low === high) throw new Error('A direct conversation requires two distinct participants');

    const existing = await this.findDirectByParticipants(this.database, low, high);
    if (existing) return existing;

    return this.database.$transaction(async (tx) => {
      // Serialize creation for this participant pair. The Prisma schema intentionally
      // has no separate direct-pair model, so the database lock supplies the uniqueness
      // boundary that the previous missing model was incorrectly assuming.
      await (tx as any).$executeRawUnsafe(
        'SELECT pg_advisory_xact_lock(hashtextextended($1, 0))',
        `direct-conversation:${low}:${high}`,
      );

      const raced = await this.findDirectByParticipants(tx, low, high);
      if (raced) return raced;

      const conversation = await tx.conversation.create({
        data: { participants: { create: [{ accountId: low }, { accountId: high }] } },
        include: { participants: { orderBy: { joinedAt: 'asc' } } },
      });
      void this.analytics?.recordBusinessEvent('conversation_started');
      return conversation;
    });
  }

  private async findDirectByParticipants(client: any, low: string, high: string): Promise<ConversationRecord | null> {
    const candidates = await client.conversationParticipant.findMany({
      where: { accountId: low },
      include: { conversation: { include: { participants: { orderBy: { joinedAt: 'asc' } } } } },
    });
    const match = candidates.find((candidate: any) => {
      const participantIds = candidate.conversation.participants
        .map((participant: { accountId: string }) => participant.accountId)
        .sort();
      return participantIds.length === 2 && participantIds[0] === low && participantIds[1] === high;
    });
    return match?.conversation ?? null;
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

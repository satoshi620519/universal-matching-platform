import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { AdministrativeConversationReadRepository, type AdministrativeConversationPage } from './administrative-conversation-read.repository.js';

@Injectable()
export class PrismaAdministrativeConversationReadRepository extends AdministrativeConversationReadRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeConversationPage> {
    const rows = await this.database.conversation.findMany({
      take: input.limit + 1,
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true, createdAt: true,
        _count: { select: { participants: true, messages: true } },
        messages: { where: { deletedAt: null }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 1, select: { createdAt: true } },
      },
    });
    const visible = rows.slice(0, input.limit).map(row => ({
      id: row.id, createdAt: row.createdAt, participantCount: row._count.participants,
      messageCount: row._count.messages, lastMessageAt: row.messages[0]?.createdAt ?? null,
    }));
    return { items: visible, nextCursor: rows.length > input.limit ? visible.at(-1)?.id ?? null : null };
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { AdministrativeMatchReadRepository, type AdministrativeMatchInteractionPage } from './administrative-match-read.repository.js';

@Injectable()
export class PrismaAdministrativeMatchReadRepository extends AdministrativeMatchReadRepository {
  constructor(private readonly database: DatabaseService) { super(); }
  async list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeMatchInteractionPage> {
    const rows = await this.database.matchInteraction.findMany({
      take: input.limit + 1,
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { id: true, actorAccountId: true, targetAccountId: true, decision: true, createdAt: true },
    });
    const items = rows.slice(0, input.limit);
    return { items, nextCursor: rows.length > input.limit ? items.at(-1)?.id ?? null : null };
  }
}

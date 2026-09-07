import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { AdministrativeAuditReadRepository, type AdministrativeAuditPage } from './administrative-audit-read.repository.js';

@Injectable()
export class PrismaAdministrativeAuditReadRepository extends AdministrativeAuditReadRepository {
  constructor(private readonly database: DatabaseService) { super(); }
  async list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeAuditPage> {
    const records = await this.database.auditRecord.findMany({
      take: input.limit + 1,
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }],
      select: { id: true, actorId: true, area: true, action: true, targetId: true, correlationId: true, occurredAt: true },
    });
    const items = records.slice(0, input.limit);
    return { items, nextCursor: records.length > input.limit ? items.at(-1)?.id ?? null : null };
  }
}

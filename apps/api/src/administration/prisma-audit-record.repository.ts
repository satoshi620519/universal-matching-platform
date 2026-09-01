import { Injectable } from '@nestjs/common';
import type { AuditRecord } from '@universal/domain';

import { DatabaseService } from '../database/database.service.js';
import {
  AuditRecordRepository,
  type AppendAuditRecordInput,
} from './audit-record.repository.js';

@Injectable()
export class PrismaAuditRecordRepository extends AuditRecordRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async append(input: AppendAuditRecordInput): Promise<AuditRecord> {
    const row = await this.database.auditRecord.create({
      data: {
        actorId: input.actorId,
        area: input.area,
        action: input.action,
        targetId: input.targetId,
        correlationId: input.correlationId,
        occurredAt: input.occurredAt,
      },
    });
    return {
      id: row.id,
      actorId: row.actorId,
      area: row.area as AuditRecord['area'],
      action: row.action,
      ...(row.targetId ? { targetId: row.targetId } : {}),
      occurredAt: row.occurredAt.toISOString(),
    };
  }
}

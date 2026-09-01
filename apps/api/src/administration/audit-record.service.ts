import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  isSensitiveActionAuditable,
  type AuditRecord,
} from '@universal/domain';

import { AuditRecordRepository } from './audit-record.repository.js';

@Injectable()
export class AuditRecordService {
  constructor(private readonly records: AuditRecordRepository) {}

  async append(input: Omit<AuditRecord, 'id'> & { readonly correlationId?: string }): Promise<AuditRecord> {
    const candidate: AuditRecord = { ...input, id: randomUUID() };
    if (!isSensitiveActionAuditable(candidate)) {
      throw new Error('Invalid audit record');
    }
    return this.records.append({
      actorId: candidate.actorId,
      area: candidate.area,
      action: candidate.action,
      ...(candidate.targetId ? { targetId: candidate.targetId } : {}),
      ...(input.correlationId ? { correlationId: input.correlationId } : {}),
      occurredAt: new Date(candidate.occurredAt),
    });
  }
}

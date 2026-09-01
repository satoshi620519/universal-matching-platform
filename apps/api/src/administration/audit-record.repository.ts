import type { AuditRecord } from '@universal/domain';

export interface AppendAuditRecordInput {
  readonly actorId: string;
  readonly area: AuditRecord['area'];
  readonly action: string;
  readonly targetId?: string;
  readonly correlationId?: string;
  readonly occurredAt: Date;
}

export abstract class AuditRecordRepository {
  abstract append(input: AppendAuditRecordInput): Promise<AuditRecord>;
}

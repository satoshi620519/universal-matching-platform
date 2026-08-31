export type SensitiveActionArea =
  | 'account'
  | 'moderation'
  | 'verification'
  | 'payment'
  | 'configuration'
  | 'security';

export interface AuditRecord {
  readonly id: string;
  readonly actorId: string;
  readonly area: SensitiveActionArea;
  readonly action: string;
  readonly targetId?: string;
  readonly occurredAt: string;
}

export function isSensitiveActionAuditable(record: AuditRecord): boolean {
  return (
    record.id.trim().length > 0 &&
    record.actorId.trim().length > 0 &&
    record.action.trim().length > 0 &&
    Number.isFinite(Date.parse(record.occurredAt))
  );
}

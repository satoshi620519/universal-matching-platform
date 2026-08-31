import type { AuditRecord } from './audit-record.js';

export type AnalyticsAuditedAction =
  | 'export-report'
  | 'configure-dashboard';

export interface AnalyticsAuditEvent {
  readonly action: AnalyticsAuditedAction;
  readonly actorId: string;
  readonly targetId: string;
  readonly occurredAt: string;
}

export function toAnalyticsAuditRecord(
  event: AnalyticsAuditEvent,
  id: string,
): AuditRecord {
  return {
    id,
    actorId: event.actorId,
    area: 'configuration',
    action: event.action,
    targetId: event.targetId,
    occurredAt: event.occurredAt,
  };
}

export function isValidAnalyticsAuditEvent(
  event: AnalyticsAuditEvent,
): boolean {
  return (
    event.actorId.trim().length > 0 &&
    event.targetId.trim().length > 0 &&
    Number.isFinite(Date.parse(event.occurredAt))
  );
}

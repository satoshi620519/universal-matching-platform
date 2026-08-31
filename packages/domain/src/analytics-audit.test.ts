import { describe, expect, it } from 'vitest';
import {
  isValidAnalyticsAuditEvent,
  toAnalyticsAuditRecord,
} from './analytics-audit.js';

describe('auditable analytics actions', () => {
  const event = {
    action: 'export-report' as const,
    actorId: 'analyst-1',
    targetId: 'report-42',
    occurredAt: '2026-08-31T00:00:00.000Z',
  };

  it('maps analytics exports onto the existing audit record foundation', () => {
    expect(toAnalyticsAuditRecord(event, 'audit-42')).toEqual({
      id: 'audit-42',
      actorId: 'analyst-1',
      area: 'configuration',
      action: 'export-report',
      targetId: 'report-42',
      occurredAt: '2026-08-31T00:00:00.000Z',
    });
  });

  it('supports dashboard configuration as a separately auditable action', () => {
    expect(
      isValidAnalyticsAuditEvent({
        ...event,
        action: 'configure-dashboard',
        targetId: 'dashboard-7',
      }),
    ).toBe(true);
  });

  it('requires actor, target and timestamp traceability', () => {
    expect(isValidAnalyticsAuditEvent({ ...event, actorId: ' ' })).toBe(false);
    expect(isValidAnalyticsAuditEvent({ ...event, targetId: '' })).toBe(false);
    expect(
      isValidAnalyticsAuditEvent({ ...event, occurredAt: 'invalid' }),
    ).toBe(false);
  });
});

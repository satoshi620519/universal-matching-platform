import { describe, expect, it } from 'vitest';
import { isSensitiveActionAuditable } from './audit-record.js';

describe('audit record', () => {
  const validRecord = {
    id: 'audit-1',
    actorId: 'admin-1',
    area: 'moderation' as const,
    action: 'suspend-user',
    targetId: 'user-1',
    correlationId: 'request-1',
    occurredAt: '2026-08-31T00:00:00.000Z',
  };

  it('accepts a complete sensitive action record', () => {
    expect(isSensitiveActionAuditable(validRecord)).toBe(true);
  });

  it('allows correlation identifiers to travel with valid audit records', () => {
    expect(isSensitiveActionAuditable(validRecord)).toBe(true);
  });

  it('requires actor and action identity', () => {
    expect(isSensitiveActionAuditable({ ...validRecord, actorId: ' ' })).toBe(false);
    expect(isSensitiveActionAuditable({ ...validRecord, action: '' })).toBe(false);
  });

  it('requires a valid occurrence timestamp', () => {
    expect(
      isSensitiveActionAuditable({ ...validRecord, occurredAt: 'not-a-time' }),
    ).toBe(false);
  });
});

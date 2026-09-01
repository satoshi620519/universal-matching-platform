import { describe, expect, it } from 'vitest';

import {
  isAdministrativeRoleAssignmentActive,
  isAdministrativeRoleKey,
} from './administrative-role.js';

describe('administrative roles', () => {
  it('accepts only stable administrative role keys', () => {
    expect(isAdministrativeRoleKey('moderator')).toBe(true);
    expect(isAdministrativeRoleKey('unknown')).toBe(false);
  });

  it('evaluates effective, expired and revoked assignments deterministically', () => {
    const now = new Date('2026-09-01T00:00:00.000Z');
    expect(isAdministrativeRoleAssignmentActive({
      accountId: 'a', role: 'moderator', effectiveAt: '2026-08-31T00:00:00.000Z',
    }, now)).toBe(true);
    expect(isAdministrativeRoleAssignmentActive({
      accountId: 'a', role: 'moderator', effectiveAt: '2026-08-31T00:00:00.000Z',
      expiresAt: '2026-08-31T12:00:00.000Z',
    }, now)).toBe(false);
    expect(isAdministrativeRoleAssignmentActive({
      accountId: 'a', role: 'moderator', effectiveAt: '2026-08-31T00:00:00.000Z',
      revokedAt: '2026-08-31T12:00:00.000Z',
    }, now)).toBe(false);
  });
});

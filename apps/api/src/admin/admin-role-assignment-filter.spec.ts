import { describe, expect, it } from 'vitest';
import { filterActiveRoleAssignments } from './admin-role-assignment-filter.js';

const now = new Date('2026-09-05T00:00:00.000Z');

describe('filterActiveRoleAssignments', () => {
  it('keeps only effective, unexpired and unrevoked assignments', () => {
    const result = filterActiveRoleAssignments([
      { role: 'moderator', effectiveAt: new Date('2026-09-04T00:00:00.000Z') },
      { role: 'safety_admin', effectiveAt: new Date('2026-09-06T00:00:00.000Z') },
      { role: 'platform_admin', effectiveAt: new Date('2026-09-04T00:00:00.000Z'), expiresAt: now },
      { role: 'moderator', effectiveAt: new Date('2026-09-04T00:00:00.000Z'), revokedAt: now },
    ], now);
    expect(result).toEqual([{ role: 'moderator' }]);
  });
});

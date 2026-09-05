import { describe, expect, it } from 'vitest';

import { isSafetyEnforcementActive } from './safety-enforcement.js';

const base = {
  id: 'enforcement-1',
  accountId: 'account-1',
  restriction: 'feature-restricted' as const,
  reasonCategory: 'policy-violation',
  status: 'active' as const,
  effectiveAt: '2026-08-01T00:00:00.000Z',
};

describe('isSafetyEnforcementActive', () => {
  it('is active at and after its effective time', () => {
    expect(
      isSafetyEnforcementActive(base, '2026-08-31T00:00:00.000Z'),
    ).toBe(true);
  });

  it('is inactive before its effective time', () => {
    expect(
      isSafetyEnforcementActive(
        { ...base, effectiveAt: '2026-09-01T00:00:00.000Z' },
        '2026-08-31T00:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('is inactive exactly at its expiry boundary', () => {
    expect(isSafetyEnforcementActive({ ...base, expiresAt: '2026-08-31T00:00:00.000Z' }, '2026-08-31T00:00:00.000Z')).toBe(false);
  });

  it('is inactive when expired', () => {
    expect(
      isSafetyEnforcementActive(
        { ...base, expiresAt: '2026-08-30T00:00:00.000Z' },
        '2026-08-31T00:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('is inactive when revoked', () => {
    expect(
      isSafetyEnforcementActive(
        { ...base, status: 'revoked', revokedAt: '2026-08-15T00:00:00.000Z' },
        '2026-08-31T00:00:00.000Z',
      ),
    ).toBe(false);
  });
});

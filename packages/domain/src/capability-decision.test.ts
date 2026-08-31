import { describe, expect, it } from 'vitest';

import { decideCapability } from './capability-decision.js';

const base = {
  accountState: 'active' as const,
  safetyRestriction: 'none' as const,
  capabilityScope: 'general' as const,
  currentVerificationLevel: 2 as const,
};

describe('decideCapability', () => {
  it('allows an active account with sufficient verification and no entitlement requirement', () => {
    expect(decideCapability(base)).toEqual({
      allowed: true,
      reason: 'allowed',
    });
  });

  it('prioritizes safety restrictions over every lower-precedence input', () => {
    expect(
      decideCapability({
        ...base,
        safetyRestriction: 'suspended',
        accountState: 'restricted',
        requiredVerificationLevel: 3,
        entitlementState: 'expired',
      }),
    ).toEqual({ allowed: false, reason: 'safety-restricted' });
  });

  it('denies a non-active account before verification and entitlement checks', () => {
    expect(
      decideCapability({
        ...base,
        accountState: 'restricted',
        requiredVerificationLevel: 3,
        entitlementState: 'expired',
      }),
    ).toEqual({ allowed: false, reason: 'account-restricted' });
  });

  it('denies insufficient verification before entitlement checks', () => {
    expect(
      decideCapability({
        ...base,
        currentVerificationLevel: 1,
        requiredVerificationLevel: 2,
        entitlementState: 'expired',
      }),
    ).toEqual({ allowed: false, reason: 'verification-insufficient' });
  });

  it('delegates entitlement state and timing semantics to canUseCapability', () => {
    expect(
      decideCapability({
        ...base,
        entitlementState: 'active',
        entitlementEffectiveAt: '2027-01-01T00:00:00.000Z',
        now: '2026-01-01T00:00:00.000Z',
      }),
    ).toEqual({ allowed: false, reason: 'entitlement-missing' });
  });

  it('allows scheduled-expiration entitlement after its effective time', () => {
    expect(
      decideCapability({
        ...base,
        entitlementState: 'scheduled-expiration',
        entitlementEffectiveAt: '2026-01-01T00:00:00.000Z',
        now: '2026-02-01T00:00:00.000Z',
      }),
    ).toEqual({ allowed: true, reason: 'allowed' });
  });
});

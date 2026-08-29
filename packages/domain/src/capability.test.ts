import { describe, expect, it } from 'vitest';
import { canUseCapability } from './capability.js';

describe('capability gate', () => {
  it('allows an eligible verified user with an active entitlement', () => {
    expect(canUseCapability({ currentVerificationLevel: 2, requiredVerificationLevel: 1, entitlementState: 'active' })).toBe(true);
  });

  it('denies a user below the required verification level', () => {
    expect(canUseCapability({ currentVerificationLevel: 1, requiredVerificationLevel: 2, entitlementState: 'active' })).toBe(false);
  });

  it('denies inactive entitlements', () => {
    expect(canUseCapability({ currentVerificationLevel: 2, requiredVerificationLevel: 1, entitlementState: 'expired' })).toBe(false);
  });

  it('denies an entitlement before its effective time', () => {
    expect(
      canUseCapability({
        currentVerificationLevel: 2,
        entitlementState: 'active',
        entitlementEffectiveAt: '2026-01-02T00:00:00Z',
        now: '2026-01-01T00:00:00Z',
      }),
    ).toBe(false);
  });
});

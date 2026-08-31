import { describe, expect, it } from 'vitest';
import { CapabilityAccessService } from './capability-access.service.js';

describe('capability access application boundary', () => {
  const service = new CapabilityAccessService();

  it('allows a capability when verification and entitlement requirements are satisfied', () => {
    expect(
      service.canUse({
        currentVerificationLevel: 2,
        requiredVerificationLevel: 2,
        entitlementState: 'active',
        entitlementEffectiveAt: '2026-01-01T00:00:00.000Z',
        now: '2026-01-02T00:00:00.000Z',
      }),
    ).toBe(true);
  });

  it('denies a capability when the verification level is insufficient', () => {
    expect(
      service.canUse({
        currentVerificationLevel: 1,
        requiredVerificationLevel: 2,
      }),
    ).toBe(false);
  });

  it('denies a capability when the entitlement is not usable', () => {
    expect(
      service.canUse({
        currentVerificationLevel: 3,
        entitlementState: 'revoked',
      }),
    ).toBe(false);
  });

  it('denies a capability before its entitlement becomes effective', () => {
    expect(
      service.canUse({
        currentVerificationLevel: 3,
        entitlementState: 'active',
        entitlementEffectiveAt: '2026-02-01T00:00:00.000Z',
        now: '2026-01-31T23:59:59.000Z',
      }),
    ).toBe(false);
  });
});

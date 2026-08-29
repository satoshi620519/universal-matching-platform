import { describe, expect, it } from 'vitest';
import { CapabilityAccessService } from './capability-access.service.js';

describe('CapabilityAccessService', () => {
  const service = new CapabilityAccessService();

  it('allows access when verification and entitlement requirements are met', () => {
    expect(
      service.evaluate({
        currentVerificationLevel: 2,
        requiredVerificationLevel: 2,
        entitlementState: 'active',
        entitlementEffectiveAt: '2026-01-01T00:00:00.000Z',
        now: '2026-02-01T00:00:00.000Z',
      }),
    ).toEqual({ allowed: true, reason: 'allowed' });
  });

  it('reports insufficient verification', () => {
    expect(
      service.evaluate({ currentVerificationLevel: 1, requiredVerificationLevel: 2 }),
    ).toEqual({ allowed: false, reason: 'verification-required' });
  });

  it('reports inactive entitlement', () => {
    expect(
      service.evaluate({ currentVerificationLevel: 2, entitlementState: 'expired' }),
    ).toEqual({ allowed: false, reason: 'entitlement-required' });
  });

  it('reports an entitlement that is not yet effective', () => {
    expect(
      service.evaluate({
        currentVerificationLevel: 2,
        entitlementState: 'active',
        entitlementEffectiveAt: '2026-03-01T00:00:00.000Z',
        now: '2026-02-01T00:00:00.000Z',
      }),
    ).toEqual({ allowed: false, reason: 'not-yet-effective' });
  });
});

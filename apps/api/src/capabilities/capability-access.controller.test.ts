import { describe, expect, it } from 'vitest';
import { CapabilityAccessController } from './capability-access.controller.js';
import { CapabilityAccessService } from './capability-access.service.js';

describe('capability access API boundary', () => {
  const controller = new CapabilityAccessController(
    new CapabilityAccessService(),
  );

  it('allows a capability when all domain requirements are satisfied', () => {
    expect(
      controller.evaluate({
        currentVerificationLevel: '2',
        requiredVerificationLevel: '1',
        entitlementState: 'active',
      }),
    ).toEqual({ allowed: true, reason: 'allowed' });
  });

  it('returns verification-required from the existing service', () => {
    expect(
      controller.evaluate({
        currentVerificationLevel: '0',
        requiredVerificationLevel: '2',
      }),
    ).toEqual({ allowed: false, reason: 'verification-required' });
  });

  it('returns not-yet-effective without duplicating domain timing rules', () => {
    expect(
      controller.evaluate({
        currentVerificationLevel: '3',
        entitlementState: 'active',
        entitlementEffectiveAt: '2026-02-02T00:00:00.000Z',
        now: '2026-02-01T00:00:00.000Z',
      }),
    ).toEqual({ allowed: false, reason: 'not-yet-effective' });
  });
});

import { describe, expect, it } from 'vitest';
import { canTransitionEntitlementState } from './entitlement.js';

describe('entitlement lifecycle', () => {
  it('allows pending entitlement to become active', () => {
    expect(canTransitionEntitlementState('pending', 'active')).toBe(true);
  });

  it('allows active entitlement to schedule expiration', () => {
    expect(canTransitionEntitlementState('active', 'scheduled-expiration')).toBe(true);
  });

  it('allows a scheduled entitlement to renew', () => {
    expect(canTransitionEntitlementState('scheduled-expiration', 'active')).toBe(true);
  });

  it('does not allow expired entitlement to become active', () => {
    expect(canTransitionEntitlementState('expired', 'active')).toBe(false);
  });

  it('does not allow revoked entitlement to become active', () => {
    expect(canTransitionEntitlementState('revoked', 'active')).toBe(false);
  });
});

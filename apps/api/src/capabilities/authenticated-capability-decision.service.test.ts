import { describe, expect, it, vi } from 'vitest';

import { AuthenticatedCapabilityDecisionService } from './authenticated-capability-decision.service.js';

describe('AuthenticatedCapabilityDecisionService', () => {
  const principal = {
    accountId: 'account-1',
    authenticationIdentityId: 'identity-1',
    verificationLevel: 2,
  };

  it('uses authoritative account status when building the domain decision context', async () => {
    const accounts = {
      resolve: vi.fn().mockResolvedValue({
        principal,
        account: { id: 'account-1', status: 'active' },
      }),
    } as any;
    const service = new AuthenticatedCapabilityDecisionService(accounts);

    await expect(
      service.evaluate(principal, {
        capabilityScope: 'general',
        safetyRestriction: 'none',
        requiredVerificationLevel: 2,
      }),
    ).resolves.toEqual({ allowed: true, reason: 'allowed' });
  });

  it('does not override an authoritative restricted account', async () => {
    const accounts = {
      resolve: vi.fn().mockResolvedValue({
        principal,
        account: { id: 'account-1', status: 'restricted' },
      }),
    } as any;
    const service = new AuthenticatedCapabilityDecisionService(accounts);

    await expect(
      service.evaluate(principal, {
        capabilityScope: 'general',
        safetyRestriction: 'none',
      }),
    ).resolves.toEqual({
      allowed: false,
      reason: 'account-restricted',
    });
  });
});

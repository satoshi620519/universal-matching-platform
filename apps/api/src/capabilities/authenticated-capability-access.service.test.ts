import { describe, expect, it } from 'vitest';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
import { CapabilityAccessService } from './capability-access.service.js';
import { AuthenticatedCapabilityAccessService } from './authenticated-capability-access.service.js';

const principal = {
  accountId: 'account-1',
  authenticationMethod: 'test',
  verificationLevel: '2',
} as const;

describe('authenticated capability access service', () => {
  function context() {
    return {
      resolve: async (value: typeof principal) => ({
        principal: value,
        account: { id: value.accountId, status: 'active' },
      }),
    } as unknown as AuthenticatedAccountContextService;
  }

  function service() {
    return new AuthenticatedCapabilityAccessService(
      context(),
      new CapabilityAccessService(),
    );
  }

  it('requires a persisted account context before evaluating access', async () => {
    await expect(service().evaluate(principal, {
      requiredVerificationLevel: 2,
    })).resolves.toEqual({ allowed: true, reason: 'allowed' });
  });

  it('denies access when verification level is insufficient', async () => {
    await expect(service().evaluate(principal, {
      requiredVerificationLevel: 3,
    })).resolves.toEqual({
      allowed: false,
      reason: 'verification-required',
    });
  });

  it('denies access when entitlement is inactive', async () => {
    await expect(service().evaluate(principal, {
      entitlementState: 'expired',
    })).resolves.toEqual({
      allowed: false,
      reason: 'entitlement-required',
    });
  });

  it('denies access before an entitlement becomes effective', async () => {
    await expect(service().evaluate(principal, {
      entitlementState: 'active',
      entitlementEffectiveAt: '2026-09-01T00:00:00.000Z',
      now: '2026-08-31T00:00:00.000Z',
    })).resolves.toEqual({
      allowed: false,
      reason: 'not-yet-effective',
    });
  });

  it('propagates a missing authenticated account failure', async () => {
    const missing = {
      resolve: async () => { throw new NotFoundException('Account not found'); },
    } as unknown as AuthenticatedAccountContextService;
    const value = new AuthenticatedCapabilityAccessService(missing, new CapabilityAccessService());

    await expect(value.evaluate(principal, {})).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects an invalid verification level as an authentication failure', async () => {
    await expect(service().evaluate({
      accountId: 'account-1',
      authenticationMethod: 'test',
      verificationLevel: 'invalid',
    }, {})).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a missing verification level', async () => {
    await expect(service().evaluate({
      accountId: 'account-1',
      authenticationMethod: 'test',
    }, {})).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

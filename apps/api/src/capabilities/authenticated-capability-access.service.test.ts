import { describe, expect, it } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
import { VerificationService } from '../verification/verification.service.js';
import { CapabilityAccessService } from './capability-access.service.js';
import { AuthenticatedCapabilityAccessService } from './authenticated-capability-access.service.js';

const principal = {
  accountId: 'account-1',
  authenticationMethod: 'test',
  verificationLevel: '3',
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

  function verification(level: 0 | 1 | 2 | 3 | null) {
    return {
      findUsableRecordForAccount: async (accountId: string, now: string) => {
        expect(accountId).toBe('account-1');
        expect(now).toBe('2026-08-31T00:00:00.000Z');
        return level === null
          ? null
          : { level, status: 'verified' };
      },
    } as unknown as VerificationService;
  }

  function service(level: 0 | 1 | 2 | 3 | null) {
    return new AuthenticatedCapabilityAccessService(
      context(),
      verification(level),
      new CapabilityAccessService(),
    );
  }

  it('uses the server-side usable verification record instead of principal claims', async () => {
    await expect(service(1).evaluate(principal, {
      requiredVerificationLevel: 2,
      now: '2026-08-31T00:00:00.000Z',
    })).resolves.toEqual({
      allowed: false,
      reason: 'verification-required',
    });
  });

  it('allows access when the persisted usable verification level is sufficient', async () => {
    await expect(service(3).evaluate({
      accountId: 'account-1',
      authenticationMethod: 'test',
    }, {
      requiredVerificationLevel: 2,
      now: '2026-08-31T00:00:00.000Z',
    })).resolves.toEqual({ allowed: true, reason: 'allowed' });
  });

  it('treats missing usable verification as level zero', async () => {
    await expect(service(null).evaluate(principal, {
      requiredVerificationLevel: 1,
      now: '2026-08-31T00:00:00.000Z',
    })).resolves.toEqual({
      allowed: false,
      reason: 'verification-required',
    });
  });

  it('denies access when entitlement is inactive', async () => {
    await expect(service(3).evaluate(principal, {
      entitlementState: 'expired',
      now: '2026-08-31T00:00:00.000Z',
    })).resolves.toEqual({ allowed: false, reason: 'entitlement-required' });
  });

  it('propagates a missing authenticated account failure', async () => {
    const missing = {
      resolve: async () => { throw new NotFoundException('Account not found'); },
    } as unknown as AuthenticatedAccountContextService;
    const value = new AuthenticatedCapabilityAccessService(
      missing,
      verification(3),
      new CapabilityAccessService(),
    );

    await expect(value.evaluate(principal, {
      now: '2026-08-31T00:00:00.000Z',
    })).rejects.toBeInstanceOf(NotFoundException);
  });
});

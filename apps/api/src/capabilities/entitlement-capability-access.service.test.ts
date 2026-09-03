import { describe, expect, it } from 'vitest';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
import { EntitlementService } from '../entitlements/entitlement.service.js';
import { CapabilityAccessService } from './capability-access.service.js';
import { EntitlementCapabilityAccessService } from './entitlement-capability-access.service.js';

const principal = { accountId: 'account-1', authenticationMethod: 'test' } as const;
const now = '2026-09-03T00:00:00.000Z';

describe('EntitlementCapabilityAccessService', () => {
  function service(record: { state: 'active' | 'revoked'; effectiveAt: Date } | null) {
    const accounts = {
      resolve: async () => ({ principal, account: { id: 'account-1', status: 'active' } }),
    } as unknown as AuthenticatedAccountContextService;
    const entitlements = {
      findUsable: async (accountId: string, key: string, at: Date) => {
        expect(accountId).toBe('account-1');
        expect(key).toBe('premium');
        expect(at.toISOString()).toBe(now);
        return record;
      },
    } as unknown as EntitlementService;
    return new EntitlementCapabilityAccessService(accounts, entitlements, new CapabilityAccessService());
  }

  it('allows a protected capability only from authoritative usable entitlement state', async () => {
    await expect(service({ state: 'active', effectiveAt: new Date('2026-09-01T00:00:00.000Z') }).evaluate(principal, {
      entitlementKey: 'premium', now,
    })).resolves.toEqual({ allowed: true, reason: 'allowed' });
  });

  it('denies access after entitlement revocation or absence', async () => {
    await expect(service(null).evaluate(principal, {
      entitlementKey: 'premium', now,
    })).resolves.toEqual({ allowed: false, reason: 'entitlement-required' });
  });
});

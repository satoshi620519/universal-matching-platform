import { describe, expect, it } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from '../auth/authentication-adapter.js';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { CapabilityAccessController } from './capability-access.controller.js';
import { CapabilityAccessService } from './capability-access.service.js';
import { AuthenticatedCapabilityAccessService } from './authenticated-capability-access.service.js';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
import { AccountRepository } from '../accounts/account.repository.js';

class StubAuthenticationAdapter extends RequestAuthenticationAdapter {
  constructor(private readonly principal: any) { super(); }
  async authenticate() { return this.principal; }
}

describe('capability access API boundary', () => {
  const service = new CapabilityAccessService();

  function controllerFor(principal: any = undefined) {
    const accounts = {
      findById: async (id: string) => principal && id === principal.accountId
        ? { id, status: 'active', createdAt: new Date(), updatedAt: new Date() }
        : null,
    } as unknown as AccountRepository;
    const context = new AuthenticatedAccountContextService(accounts);
    return new CapabilityAccessController(
      service,
      new RequestPrincipalResolver(new StubAuthenticationAdapter(principal)),
      new AuthenticatedCapabilityAccessService(context, service),
    );
  }

  it('rejects an invalid verification level at the HTTP boundary', () => {
    expect(() => controllerFor().evaluate({ currentVerificationLevel: '4' })).toThrow();
  });

  it('rejects an invalid entitlement state at the HTTP boundary', () => {
    expect(() => controllerFor().evaluate({ currentVerificationLevel: '1', entitlementState: 'unknown' })).toThrow();
  });

  it('rejects an invalid entitlement effective date at the HTTP boundary', () => {
    expect(() => controllerFor().evaluate({
      currentVerificationLevel: '1',
      entitlementEffectiveAt: 'not-a-date',
    })).toThrow();
  });

  it('rejects an invalid current time at the HTTP boundary', () => {
    expect(() => controllerFor().evaluate({
      currentVerificationLevel: '1',
      now: 'not-a-date',
    })).toThrow();
  });

  it('allows a capability when all domain requirements are satisfied', () => {
    expect(
      controllerFor().evaluate({
        currentVerificationLevel: '2',
        requiredVerificationLevel: '1',
        entitlementState: 'active',
      }),
    ).toEqual({ allowed: true, reason: 'allowed' });
  });

  it('returns verification-required from the existing service', () => {
    expect(
      controllerFor().evaluate({
        currentVerificationLevel: '0',
        requiredVerificationLevel: '2',
      }),
    ).toEqual({ allowed: false, reason: 'verification-required' });
  });

  it('returns not-yet-effective without duplicating domain timing rules', () => {
    expect(
      controllerFor().evaluate({
        currentVerificationLevel: '3',
        entitlementState: 'active',
        entitlementEffectiveAt: '2026-02-02T00:00:00.000Z',
        now: '2026-02-01T00:00:00.000Z',
      }),
    ).toEqual({ allowed: false, reason: 'not-yet-effective' });
  });

  it('uses the authenticated principal verification level', async () => {
    await expect(controllerFor({
      accountId: 'account-1',
      authenticationMethod: 'test',
      verificationLevel: '3',
    }).evaluateAuthenticated({
      requiredVerificationLevel: '3',
    })).resolves.toEqual({ allowed: true, reason: 'allowed' });
  });

  it('does not use a client-supplied verification level on the authenticated route', async () => {
    await expect(controllerFor({
      accountId: 'account-1',
      authenticationMethod: 'test',
      verificationLevel: '1',
    }).evaluateAuthenticated({
      requiredVerificationLevel: '2',
    })).resolves.toEqual({ allowed: false, reason: 'verification-required' });
  });

  it('returns unauthorized when authentication is absent', async () => {
    await expect(controllerFor().evaluateAuthenticated({
      requiredVerificationLevel: '1',
    })).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a malformed principal verification level', async () => {
    await expect(controllerFor({
      accountId: 'account-1',
      authenticationMethod: 'test',
      verificationLevel: 'invalid',
    }).evaluateAuthenticated({})).rejects.toBeInstanceOf(BadRequestException);
  });
});

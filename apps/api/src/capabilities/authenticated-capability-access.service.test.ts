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

  it('requires a persisted account context before evaluating access', async () => {
    const service = new AuthenticatedCapabilityAccessService(
      context(),
      new CapabilityAccessService(),
    );

    await expect(service.evaluate(principal, {
      requiredVerificationLevel: 2,
    })).resolves.toEqual({ allowed: true, reason: 'allowed' });
  });

  it('propagates a missing authenticated account failure', async () => {
    const missing = {
      resolve: async () => { throw new NotFoundException('Account not found'); },
    } as unknown as AuthenticatedAccountContextService;
    const service = new AuthenticatedCapabilityAccessService(missing, new CapabilityAccessService());

    await expect(service.evaluate(principal, {})).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects an invalid verification level as an authentication failure', async () => {
    const service = new AuthenticatedCapabilityAccessService(
      context(),
      new CapabilityAccessService(),
    );

    await expect(service.evaluate({
      accountId: 'account-1',
      authenticationMethod: 'test',
      verificationLevel: 'invalid',
    }, {})).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a missing verification level', async () => {
    const service = new AuthenticatedCapabilityAccessService(
      context(),
      new CapabilityAccessService(),
    );

    await expect(service.evaluate({
      accountId: 'account-1',
      authenticationMethod: 'test',
    }, {})).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

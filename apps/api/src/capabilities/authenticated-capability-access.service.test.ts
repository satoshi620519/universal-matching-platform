import { describe, expect, it } from 'vitest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
import { CapabilityAccessService } from './capability-access.service.js';
import { AuthenticatedCapabilityAccessService } from './authenticated-capability-access.service.js';

const principal = {
  accountId: 'account-1',
  authenticationMethod: 'test',
  verificationLevel: '2',
} as const;

describe('authenticated capability access service', () => {
  function context(result: unknown = {
    principal,
    account: { id: 'account-1', status: 'active' },
  }) {
    return {
      resolve: async (value: unknown) => {
        expect(value).toBe(principal);
        return result;
      },
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

  it('rejects a missing verification level', async () => {
    const service = new AuthenticatedCapabilityAccessService(
      context(),
      new CapabilityAccessService(),
    );

    await expect(service.evaluate({
      accountId: 'account-1',
      authenticationMethod: 'test',
    }, {})).rejects.toBeInstanceOf(BadRequestException);
  });
});

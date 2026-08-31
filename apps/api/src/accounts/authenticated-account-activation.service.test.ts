import { describe, expect, it } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { AccountActivationService } from './account-activation.service.js';
import { AuthenticatedAccountActivationService } from './authenticated-account-activation.service.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';
import { AccountRepository } from './account.repository.js';

describe('authenticated account activation service', () => {
  const principal = { accountId: 'account-1', authenticationMethod: 'test' } as const;
  const account = {
    id: 'account-1',
    status: 'pending-onboarding' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  function contextFor() {
    return {
      resolve: async (value: typeof principal) => {
        expect(value).toBe(principal);
        return { principal, account };
      },
    } as unknown as AuthenticatedAccountContextService;
  }

  it('activates and persists only the account resolved from the authenticated principal', async () => {
    const repository = {
      updateStatus: async (id: string, status: string) => {
        expect(id).toBe('account-1');
        expect(status).toBe('active');
        return { ...account, status: 'active' as const };
      },
    } as unknown as AccountRepository;

    const service = new AuthenticatedAccountActivationService(
      contextFor(),
      new AccountActivationService(),
      repository,
    );

    await expect(service.activate(principal)).resolves.toEqual({
      accountId: 'account-1',
      state: 'active',
    });
  });

  it('rejects when the account disappears before persistence', async () => {
    const repository = {
      updateStatus: async () => null,
    } as unknown as AccountRepository;

    const service = new AuthenticatedAccountActivationService(
      contextFor(),
      new AccountActivationService(),
      repository,
    );

    await expect(service.activate(principal)).rejects.toBeInstanceOf(NotFoundException);
  });
});

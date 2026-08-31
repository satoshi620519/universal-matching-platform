import { describe, expect, it } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { AuthenticatedAccountDeletionRequestService } from './authenticated-account-deletion-request.service.js';
import { AccountDeletionRequestService } from './account-deletion-request.service.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';
import { AccountRepository } from './account.repository.js';

describe('authenticated account deletion request service', () => {
  const principal = { accountId: 'account-1', authenticationMethod: 'test' } as const;
  const account = {
    id: 'account-1',
    status: 'active' as const,
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

  it('marks only the account resolved from the authenticated principal pending deletion', async () => {
    const repository = {
      updateStatus: async (id: string, status: string) => {
        expect(id).toBe('account-1');
        expect(status).toBe('pending-deletion');
        return { ...account, status: 'pending-deletion' as const };
      },
    } as unknown as AccountRepository;

    const service = new AuthenticatedAccountDeletionRequestService(
      contextFor(),
      new AccountDeletionRequestService(),
      repository,
    );

    await expect(service.requestDeletion(principal)).resolves.toEqual({
      accountId: 'account-1',
      state: 'pending-deletion',
    });
  });

  it('rejects when the account disappears before persistence', async () => {
    const repository = {
      updateStatus: async () => null,
    } as unknown as AccountRepository;

    const service = new AuthenticatedAccountDeletionRequestService(
      contextFor(),
      new AccountDeletionRequestService(),
      repository,
    );

    await expect(service.requestDeletion(principal)).rejects.toBeInstanceOf(NotFoundException);
  });
});

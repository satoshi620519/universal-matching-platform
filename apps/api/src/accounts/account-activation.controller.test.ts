import { describe, expect, it } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { AccountActivationController } from './account-activation.controller.js';
import { AccountActivationService } from './account-activation.service.js';
import { AccountRepository } from './account.repository.js';

describe('account activation HTTP boundary', () => {
  const pending = {
    id: 'account-1',
    status: 'pending-onboarding' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  function controllerFor(
    account: typeof pending | null = pending,
    persisted: { ...typeof pending; status: 'active' } | null = {
      ...pending,
      status: 'active' as const,
    },
  ) {
    const repository = {
      findById: async () => account,
      updateStatus: async (id: string, status: string) => {
        expect(id).toBe('account-1');
        expect(status).toBe('active');
        return persisted;
      },
    } as unknown as AccountRepository;

    return new AccountActivationController(repository, new AccountActivationService());
  }

  it('persists the legacy route activation state', async () => {
    await expect(controllerFor().activate('account-1')).resolves.toEqual({
      accountId: 'account-1',
      state: 'active',
    });
  });

  it('rejects a missing account', async () => {
    await expect(controllerFor(null).activate('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects when the account disappears before persistence', async () => {
    await expect(controllerFor(pending, null).activate('account-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});

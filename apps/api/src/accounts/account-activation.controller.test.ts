import { describe, expect, it } from 'vitest';
import type { AccountState } from '@universal/domain';
import { AccountActivationController } from './account-activation.controller.js';
import { AccountActivationService } from './account-activation.service.js';
import { AccountRepository, type AccountRecord, type CreateAccountRecord } from './account.repository.js';

function account(status: AccountState): AccountRecord {
  return { id: 'account-1', status, createdAt: new Date(), updatedAt: new Date() };
}

describe('account activation API boundary', () => {
  it('activates an existing account through the validated application service', async () => {
    class Repository extends AccountRepository {
      async create(input: CreateAccountRecord): Promise<AccountRecord> { return account(input.status); }
      async findById(_id: string): Promise<AccountRecord | null> { return account('pending-onboarding' as AccountState); }
    }
    const controller = new AccountActivationController(new Repository(), new AccountActivationService());
    await expect(controller.activate('account-1', {})).resolves.toEqual({ accountId: 'account-1', state: 'active' });
  });

  it('returns not found before attempting activation for an unknown account', async () => {
    class Repository extends AccountRepository {
      async create(input: CreateAccountRecord): Promise<AccountRecord> { return account(input.status); }
      async findById(_id: string): Promise<AccountRecord | null> { return null; }
    }
    const controller = new AccountActivationController(new Repository(), new AccountActivationService());
    await expect(controller.activate('missing', {})).rejects.toMatchObject({ status: 404 });
  });
});

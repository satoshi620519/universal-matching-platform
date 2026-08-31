import { describe, expect, it } from 'vitest';
import { AccountLookupService } from './account-lookup.service.js';
import { AccountRepository, type AccountRecord, type CreateAccountRecord } from './account.repository.js';

describe('account lookup application boundary', () => {
  it('delegates lookup to the existing account repository', async () => {
    class Repository extends AccountRepository {
      async create(_input: CreateAccountRecord): Promise<AccountRecord> {
        throw new Error('not used');
      }

      async findById(id: string): Promise<AccountRecord | null> {
        expect(id).toBe('account-1');
        return {
          id,
          status: 'active',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        };
      }
    }

    const service = new AccountLookupService(new Repository());

    await expect(service.findById('account-1')).resolves.toMatchObject({
      id: 'account-1',
      status: 'active',
    });
  });

  it('preserves a repository miss as null', async () => {
    class Repository extends AccountRepository {
      async create(_input: CreateAccountRecord): Promise<AccountRecord> {
        throw new Error('not used');
      }

      async findById(_id: string): Promise<AccountRecord | null> {
        return null;
      }
    }

    const service = new AccountLookupService(new Repository());
    await expect(service.findById('missing')).resolves.toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { AccountRepository, type AccountRecord, type CreateAccountRecord } from './account.repository.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';

class Repository extends AccountRepository {
  constructor(private readonly record: AccountRecord | null) { super(); }
  async create(_input: CreateAccountRecord): Promise<AccountRecord> { throw new Error('not used'); }
  async findById(_id: string): Promise<AccountRecord | null> { return this.record; }
  async updateStatus(_id: string, _status: AccountRecord['status']): Promise<AccountRecord | null> { throw new Error('not used'); }
}

const principal = { accountId: 'account-1', authenticationMethod: 'test' } as const;
const record: AccountRecord = {
  id: 'account-1',
  status: 'active',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('authenticated account context service', () => {
  it('combines the authenticated principal with its persisted account', async () => {
    const service = new AuthenticatedAccountContextService(new Repository(record));
    await expect(service.resolve(principal)).resolves.toEqual({ principal, account: record });
  });

  it('does not create context for a principal without a persisted account', async () => {
    const service = new AuthenticatedAccountContextService(new Repository(null));
    await expect(service.resolve(principal)).rejects.toBeInstanceOf(NotFoundException);
  });
});

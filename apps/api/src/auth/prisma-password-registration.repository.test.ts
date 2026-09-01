import { describe, expect, it, vi } from 'vitest';

import { PrismaPasswordRegistrationRepository } from './prisma-password-registration.repository.js';

describe('PrismaPasswordRegistrationRepository', () => {
  it('creates account, identity and credential inside one transaction', async () => {
    const credentialCreate = vi.fn().mockResolvedValue({});
    const identityCreate = vi.fn().mockResolvedValue({
      id: 'identity-1',
      accountId: 'account-1',
      providerType: 'email-password',
      providerSubject: 'user@example.test',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const accountCreate = vi.fn().mockResolvedValue({
      id: 'account-1',
      status: 'pending-onboarding',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const callback = vi.fn(async (tx) => {
      return tx;
    });
    const database = {
      $transaction: vi.fn(async (work) => work({
        account: { create: accountCreate },
        authenticationIdentity: { create: identityCreate },
        passwordCredential: { create: credentialCreate },
      })),
    } as any;

    const repository = new PrismaPasswordRegistrationRepository(database);

    const result = await repository.create({
      accountStatus: 'pending-onboarding',
      providerType: 'email-password',
      providerSubject: 'user@example.test',
      passwordHash: 'opaque-hash',
    });

    expect(database.$transaction).toHaveBeenCalledTimes(1);
    expect(accountCreate).toHaveBeenCalledWith({ data: { status: 'pending-onboarding' } });
    expect(identityCreate).toHaveBeenCalledWith({
      data: {
        accountId: 'account-1',
        providerType: 'email-password',
        providerSubject: 'user@example.test',
        status: 'active',
      },
    });
    expect(credentialCreate).toHaveBeenCalledWith({
      data: {
        authenticationIdentityId: 'identity-1',
        passwordHash: 'opaque-hash',
        status: 'active',
      },
    });
    expect(result.account.id).toBe('account-1');
    expect(result.authenticationIdentity.id).toBe('identity-1');
  });

  it('propagates a transaction failure instead of continuing outside the transaction', async () => {
    const failure = new Error('credential write failed');
    const database = {
      $transaction: vi.fn(async () => {
        throw failure;
      }),
    } as any;
    const repository = new PrismaPasswordRegistrationRepository(database);

    await expect(repository.create({
      accountStatus: 'pending-onboarding',
      providerType: 'email-password',
      providerSubject: 'user@example.test',
      passwordHash: 'opaque-hash',
    })).rejects.toBe(failure);
  });
});

import { describe, expect, it, vi } from 'vitest';

import {
  AuthenticationIdentityRepository,
  type AuthenticationIdentityRecord,
} from './authentication-identity.repository.js';
import { AuthenticationIdentityService } from './authentication-identity.service.js';

const identity = (
  status: 'active' | 'inactive' = 'active',
): AuthenticationIdentityRecord => ({
  id: 'identity-1',
  accountId: 'account-1',
  providerType: 'email',
  providerSubject: 'user@example.test',
  status,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('AuthenticationIdentityService', () => {
  it('creates active identities', async () => {
    const repository = {
      create: vi.fn().mockResolvedValue(identity()),
      findByProviderIdentity: vi.fn(),
      updateStatus: vi.fn(),
    } as unknown as AuthenticationIdentityRepository;
    const service = new AuthenticationIdentityService(repository);

    await service.create({
      accountId: 'account-1',
      providerType: 'email',
      providerSubject: 'user@example.test',
    });

    expect(repository.create).toHaveBeenCalledWith({
      accountId: 'account-1',
      providerType: 'email',
      providerSubject: 'user@example.test',
      status: 'active',
    });
  });

  it('returns only active identities for authentication lookup', async () => {
    const repository = {
      create: vi.fn(),
      findByProviderIdentity: vi.fn().mockResolvedValue(identity('inactive')),
      updateStatus: vi.fn(),
    } as unknown as AuthenticationIdentityRepository;
    const service = new AuthenticationIdentityService(repository);

    await expect(
      service.findActiveByProviderIdentity('email', 'user@example.test'),
    ).resolves.toBeNull();
  });

  it('deactivates an identity', async () => {
    const repository = {
      create: vi.fn(),
      findByProviderIdentity: vi.fn(),
      updateStatus: vi.fn().mockResolvedValue(identity('inactive')),
    } as unknown as AuthenticationIdentityRepository;
    const service = new AuthenticationIdentityService(repository);

    await expect(service.deactivate('identity-1')).resolves.toMatchObject({
      status: 'inactive',
    });
    expect(repository.updateStatus).toHaveBeenCalledWith(
      'identity-1',
      'inactive',
    );
  });
});

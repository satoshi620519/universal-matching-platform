import { describe, expect, it, vi } from 'vitest';

import { PasswordSignInService } from './password-sign-in.service.js';

describe('PasswordSignInService', () => {
  function createService() {
    const identities = {
      findByProviderIdentity: vi.fn().mockResolvedValue({
        id: 'identity-1',
        accountId: 'account-1',
        status: 'active',
      }),
    };
    const credentials = {
      findByAuthenticationIdentityId: vi.fn().mockResolvedValue({
        authenticationIdentityId: 'identity-1',
        passwordHash: 'opaque-hash',
        status: 'active',
      }),
    };
    const passwordHasher = { verify: vi.fn().mockResolvedValue(true) };

    return {
      identities,
      credentials,
      passwordHasher,
      service: new PasswordSignInService(
        identities as any,
        credentials as any,
        passwordHasher as any,
      ),
    };
  }

  it('authenticates an active identity with an active matching credential', async () => {
    const { service } = createService();

    await expect(service.signIn({
      email: ' User@Example.TEST ',
      password: 'password',
    })).resolves.toEqual({ kind: 'authenticated', accountId: 'account-1' });
  });

  it('rejects unknown identities without attempting password verification', async () => {
    const { identities, passwordHasher, service } = createService();
    identities.findByProviderIdentity.mockResolvedValue(null);

    await expect(service.signIn({
      email: 'user@example.test',
      password: 'password',
    })).resolves.toEqual({ kind: 'rejected' });

    expect(passwordHasher.verify).not.toHaveBeenCalled();
  });

  it('rejects disabled credentials and invalid passwords', async () => {
    const { credentials, passwordHasher, service } = createService();
    credentials.findByAuthenticationIdentityId.mockResolvedValue({
      authenticationIdentityId: 'identity-1',
      passwordHash: 'opaque-hash',
      status: 'disabled',
    });

    await expect(service.signIn({
      email: 'user@example.test',
      password: 'password',
    })).resolves.toEqual({ kind: 'rejected' });
    expect(passwordHasher.verify).not.toHaveBeenCalled();
  });

  it('rejects malformed email input before repository access', async () => {
    const { identities, service } = createService();

    await expect(service.signIn({
      email: 'invalid',
      password: 'password',
    })).resolves.toEqual({ kind: 'rejected' });

    expect(identities.findByProviderIdentity).not.toHaveBeenCalled();
  });
});

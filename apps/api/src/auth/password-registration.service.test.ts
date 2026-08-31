import { describe, expect, it, vi } from 'vitest';

import { PasswordRegistrationService } from './password-registration.service.js';

describe('PasswordRegistrationService', () => {
  it('hashes plaintext before invoking atomic registration persistence', async () => {
    const hash = vi.fn().mockResolvedValue('opaque-hash');
    const create = vi.fn().mockResolvedValue({
      account: { id: 'account-1', status: 'pending' },
      authenticationIdentity: { id: 'identity-1', accountId: 'account-1' },
    });

    const service = new PasswordRegistrationService(
      { hash } as any,
      { create } as any,
    );

    await service.register({
      providerSubject: 'user@example.test',
      password: 'plaintext-secret',
    });

    expect(hash).toHaveBeenCalledWith('plaintext-secret');
    expect(create).toHaveBeenCalledWith({
      accountStatus: 'pending',
      providerType: 'email-password',
      providerSubject: 'user@example.test',
      passwordHash: 'opaque-hash',
    });
  });

  it('does not persist anything when hashing fails', async () => {
    const failure = new Error('hashing failed');
    const hash = vi.fn().mockRejectedValue(failure);
    const create = vi.fn();
    const service = new PasswordRegistrationService(
      { hash } as any,
      { create } as any,
    );

    await expect(service.register({
      providerSubject: 'user@example.test',
      password: 'plaintext-secret',
    })).rejects.toBe(failure);

    expect(create).not.toHaveBeenCalled();
  });

  it('propagates atomic persistence failures without retrying outside the boundary', async () => {
    const failure = new Error('transaction failed');
    const hash = vi.fn().mockResolvedValue('opaque-hash');
    const create = vi.fn().mockRejectedValue(failure);
    const service = new PasswordRegistrationService(
      { hash } as any,
      { create } as any,
    );

    await expect(service.register({
      providerSubject: 'user@example.test',
      password: 'plaintext-secret',
    })).rejects.toBe(failure);

    expect(create).toHaveBeenCalledTimes(1);
  });
});

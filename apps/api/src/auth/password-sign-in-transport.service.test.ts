import { describe, expect, it, vi } from 'vitest';

import { PasswordSignInTransportService } from './password-sign-in-transport.service.js';

describe('PasswordSignInTransportService', () => {
  function createService() {
    const limiter = { consume: vi.fn().mockReturnValue({ allowed: true }) };
    const signIn = vi.fn().mockResolvedValue({
      kind: 'authenticated',
      accountId: 'account-1',
    });
    const sessions = { issue: vi.fn().mockResolvedValue({ credential: 'opaque' }) };
    return {
      limiter,
      signIn,
      sessions,
      service: new PasswordSignInTransportService(
        limiter as any,
        { signIn } as any,
        sessions as any,
      ),
    };
  }

  it('issues a session only after successful credential verification', async () => {
    const { service, sessions } = createService();

    await expect(service.signInRequest({
      email: 'user@example.test',
      password: 'password',
      rateLimitKey: 'key',
    })).resolves.toEqual({ kind: 'accepted', credential: 'opaque' });

    expect(sessions.issue).toHaveBeenCalledWith({
      accountId: 'account-1',
      authenticationMethod: 'password',
    });
  });

  it('does not issue a session for rejected credentials', async () => {
    const { service, signIn, sessions } = createService();
    signIn.mockResolvedValue({ kind: 'rejected' });

    await expect(service.signInRequest({
      email: 'user@example.test',
      password: 'wrong',
      rateLimitKey: 'key',
    })).resolves.toEqual({ kind: 'rejected' });

    expect(sessions.issue).not.toHaveBeenCalled();
  });
});

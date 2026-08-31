import { describe, expect, it, vi } from 'vitest';

import { PasswordSignInController } from './password-sign-in.controller.js';

describe('PasswordSignInController', () => {
  it('returns an opaque credential only for accepted authentication', async () => {
    const signInRequest = vi.fn().mockResolvedValue({
      kind: 'accepted',
      credential: 'opaque-session-secret',
    });
    const controller = new PasswordSignInController({ signInRequest } as any);

    await expect(controller.signInRequest(
      { email: 'user@example.test', password: 'password' },
      { ip: '203.0.113.7' } as any,
    )).resolves.toEqual({ credential: 'opaque-session-secret' });

    expect(signInRequest.mock.calls[0][0].rateLimitKey).not.toContain('203.0.113.7');
  });

  it('returns the same empty response for rejected authentication', async () => {
    const signInRequest = vi.fn().mockResolvedValue({ kind: 'rejected' });
    const controller = new PasswordSignInController({ signInRequest } as any);

    await expect(controller.signInRequest(
      { email: 'unknown@example.test', password: 'wrong' },
      { ip: '203.0.113.7' } as any,
    )).resolves.toEqual({});
  });

  it('converts malformed transport fields to generic invalid credentials', async () => {
    const signInRequest = vi.fn().mockResolvedValue({ kind: 'rejected' });
    const controller = new PasswordSignInController({ signInRequest } as any);

    await controller.signInRequest(
      { email: 123, password: null },
      { ip: '203.0.113.7' } as any,
    );

    expect(signInRequest).toHaveBeenCalledWith(expect.objectContaining({
      email: '',
      password: '',
    }));
  });
});

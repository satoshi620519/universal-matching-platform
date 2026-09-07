import { describe, expect, it, vi } from 'vitest';
import { PasswordSignInController } from './password-sign-in-controller.js';

describe('PasswordSignInController', () => {
  it('sets the HttpOnly admin session cookie after accepted sign-in', async () => {
    const signInRequest = vi.fn().mockResolvedValue({
      kind: 'accepted',
      credential: 'opaque-token',
    });
    const controller = new PasswordSignInController({ signInRequest } as never);
    const reply = { header: vi.fn() };

    const result = await controller.signInRequest(
      { email: 'admin@example.com', password: 'secret' },
      { ip: '127.0.0.1' } as never,
      reply as never,
    );

    expect(signInRequest).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'secret',
      rateLimitKey: '127.0.0.1',
    });
    expect(reply.header).toHaveBeenCalledWith(
      'set-cookie',
      'universal_admin_session=opaque-token; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800',
    );
    expect(result).toEqual({ authenticated: true });
  });

  it('does not issue a session cookie after rejected sign-in', async () => {
    const signInRequest = vi.fn().mockResolvedValue({ kind: 'rejected' });
    const controller = new PasswordSignInController({ signInRequest } as never);
    const reply = { header: vi.fn() };

    const result = await controller.signInRequest(
      { email: 'admin@example.com', password: 'wrong' },
      { ip: '127.0.0.1' } as never,
      reply as never,
    );

    expect(reply.header).not.toHaveBeenCalled();
    expect(result).toEqual({ authenticated: false });
  });
});

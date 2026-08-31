import { describe, expect, it, vi } from 'vitest';

import { SessionController } from './session.controller.js';

describe('SessionController', () => {
  it('revokes the authenticated current session', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({
      accountId: 'account-1',
      authenticationMethod: 'password',
      sessionId: 'session-1',
    });
    const revoke = vi.fn().mockResolvedValue(undefined);
    const controller = new SessionController(
      { requireAuthenticated } as any,
      { revoke } as any,
    );

    await controller.signOut('Bearer opaque', 'request-1');

    expect(requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer opaque',
      requestId: 'request-1',
    });
    expect(revoke).toHaveBeenCalledWith('session-1');
  });

  it('uses a stable request id fallback', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({
      accountId: 'account-1',
      authenticationMethod: 'password',
      sessionId: 'session-1',
    });
    const controller = new SessionController(
      { requireAuthenticated } as any,
      { revoke: vi.fn() } as any,
    );

    await controller.signOut('Bearer opaque');

    expect(requireAuthenticated).toHaveBeenCalledWith(expect.objectContaining({
      requestId: 'auth-sign-out',
    }));
  });
});

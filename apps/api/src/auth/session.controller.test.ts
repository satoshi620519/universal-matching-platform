import { describe, expect, it, vi } from 'vitest';

import { SessionController } from './session.controller.js';

function createRequest(cookie?: string) {
  return {
    headers: cookie ? { cookie } : {},
  } as any;
}

function createReply() {
  return {
    header: vi.fn(),
  } as any;
}

describe('SessionController', () => {
  it('revokes the authenticated current session and clears the cookie', async () => {
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
    const reply = createReply();

    await controller.signOut('Bearer opaque', 'request-1', createRequest(), reply);

    expect(requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer opaque',
      requestId: 'request-1',
    });
    expect(revoke).toHaveBeenCalledWith('session-1');
    expect(reply.header).toHaveBeenCalledWith(
      'set-cookie',
      'universal_admin_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    );
  });

  it('authenticates sign-out from the admin session cookie when no bearer header is present', async () => {
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

    await controller.signOut(undefined, undefined, createRequest('universal_admin_session=opaque-cookie'), createReply());

    expect(requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer opaque-cookie',
      requestId: 'auth-sign-out',
    });
    expect(revoke).toHaveBeenCalledWith('session-1');
  });

  it('prefers an explicit bearer header over the admin session cookie', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({
      accountId: 'account-1',
      authenticationMethod: 'password',
      sessionId: 'session-1',
    });
    const controller = new SessionController(
      { requireAuthenticated } as any,
      { revoke: vi.fn() } as any,
    );

    await controller.signOut(
      'Bearer explicit',
      'request-1',
      createRequest('universal_admin_session=opaque-cookie'),
      createReply(),
    );

    expect(requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer explicit',
      requestId: 'request-1',
    });
  });
});

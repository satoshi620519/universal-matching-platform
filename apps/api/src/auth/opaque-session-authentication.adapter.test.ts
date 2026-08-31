import { describe, expect, it, vi } from 'vitest';

import { OpaqueSessionAuthenticationAdapter } from './opaque-session-authentication.adapter.js';

describe('OpaqueSessionAuthenticationAdapter', () => {
  function createAdapter(session: any = null) {
    const sessions = {
      findByCredentialHash: vi.fn().mockResolvedValue(session),
    };
    return {
      sessions,
      adapter: new OpaqueSessionAuthenticationAdapter(sessions as any),
    };
  }

  it('resolves an active unexpired session to a principal', async () => {
    const { adapter } = createAdapter({
      id: 'session-1',
      accountId: 'account-1',
      authenticationMethod: 'password',
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(adapter.authenticate({
      authorization: 'Bearer opaque-secret',
      requestId: 'request-1',
    })).resolves.toEqual({
      accountId: 'account-1',
      authenticationMethod: 'password',
      sessionId: 'session-1',
    });
  });

  it('rejects missing, revoked and expired sessions', async () => {
    const { adapter: missing } = createAdapter();
    await expect(missing.authenticate({ requestId: 'r' })).resolves.toBeUndefined();

    const { adapter: revoked } = createAdapter({
      revokedAt: new Date(),
      expiresAt: new Date(Date.now() + 60_000),
    });
    await expect(revoked.authenticate({
      authorization: 'Bearer secret', requestId: 'r',
    })).resolves.toBeUndefined();

    const { adapter: expired } = createAdapter({
      revokedAt: null,
      expiresAt: new Date(Date.now() - 1),
    });
    await expect(expired.authenticate({
      authorization: 'Bearer secret', requestId: 'r',
    })).resolves.toBeUndefined();
  });
});

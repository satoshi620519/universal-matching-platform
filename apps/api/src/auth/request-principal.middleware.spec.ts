import { describe, expect, it, vi } from 'vitest';

import { createRequestPrincipalResolver } from './request-principal.middleware.js';
import { getRequestPrincipal, type AuthenticatedFastifyRequest } from './authenticated-request.js';
import type { RequestPrincipal } from './request-principal.js';
import type { RequestAuthenticationAdapter } from './authentication-adapter.js';

const principal: RequestPrincipal = {
  accountId: 'account-1',
  authenticationMethod: 'opaque-session',
  sessionId: 'session-1',
};

function request(headers: Record<string, string>): AuthenticatedFastifyRequest {
  return { headers } as unknown as AuthenticatedFastifyRequest;
}

describe('request principal resolver', () => {
  it('authenticates with the admin session cookie when authorization is absent', async () => {
    const adapter: RequestAuthenticationAdapter = {
      authenticate: vi.fn().mockResolvedValue(principal),
    };
    const currentRequest = request({
      cookie: 'universal_admin_session=raw%20credential',
      'x-correlation-id': 'correlation-1',
    });

    await createRequestPrincipalResolver(adapter)(currentRequest);

    expect(adapter.authenticate).toHaveBeenCalledWith({
      authorization: 'Bearer raw credential',
      requestId: 'correlation-1',
    });
    expect(getRequestPrincipal(currentRequest)).toEqual(principal);
  });

  it('keeps an explicit authorization header ahead of the session cookie', async () => {
    const adapter: RequestAuthenticationAdapter = {
      authenticate: vi.fn().mockResolvedValue(principal),
    };
    const currentRequest = request({
      authorization: 'Bearer explicit-credential',
      cookie: 'universal_admin_session=cookie-credential',
      'x-correlation-id': 'correlation-2',
    });

    await createRequestPrincipalResolver(adapter)(currentRequest);

    expect(adapter.authenticate).toHaveBeenCalledWith({
      authorization: 'Bearer explicit-credential',
      requestId: 'correlation-2',
    });
  });
});

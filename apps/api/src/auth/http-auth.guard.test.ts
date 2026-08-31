import { describe, expect, it } from 'vitest';
import { HttpAuthenticationGuard } from './http-auth.guard.js';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import type { AuthenticatedFastifyRequest } from './authenticated-request.js';

describe('HTTP authentication guard', () => {
  it('authenticates through the adapter and attaches the principal', async () => {
    class Adapter extends RequestAuthenticationAdapter {
      async authenticate(input: {
        readonly authorization?: string;
        readonly requestId: string;
      }) {
        expect(input.authorization).toBe('Bearer token');
        expect(input.requestId).toBe('req-1');
        return { accountId: 'account-1', authenticationMethod: 'bearer' };
      }
    }

    const request = {
      id: 'req-1',
      headers: { authorization: 'Bearer token' },
    } as unknown as AuthenticatedFastifyRequest;
    const guard = new HttpAuthenticationGuard(new Adapter());

    await expect(
      guard.canActivate({
        switchToHttp: () => ({ getRequest: () => request }),
      } as never),
    ).resolves.toBe(true);
    expect(request.principal).toEqual({
      accountId: 'account-1',
      authenticationMethod: 'bearer',
    });
  });

  it('rejects an unauthenticated request with 401', async () => {
    class EmptyAdapter extends RequestAuthenticationAdapter {
      async authenticate() {
        return undefined;
      }
    }

    const guard = new HttpAuthenticationGuard(new EmptyAdapter());

    await expect(
      guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({ headers: {} }),
        }),
      } as never),
    ).rejects.toMatchObject({ status: 401 });
  });
});

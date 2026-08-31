import { describe, expect, it } from 'vitest';
import { HttpAuthenticationGuard } from './http-auth.guard.js';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';

describe('HTTP authentication guard', () => {
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

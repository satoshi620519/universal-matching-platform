import { describe, expect, it } from 'vitest';
import { createRequestPrincipalResolver } from './request-principal.middleware.js';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import { getRequestPrincipal } from './authenticated-request.js';

describe('request principal lifecycle', () => {
  it('resolves authentication exactly once and stores the shared principal', async () => {
    let calls = 0;

    class CountingAdapter extends RequestAuthenticationAdapter {
      async authenticate(_input: {
        readonly authorization?: string;
        readonly requestId: string;
      }) {
        calls += 1;
        return {
          accountId: '00000000-0000-0000-0000-000000000001',
          authenticationMethod: 'test',
          verificationLevel: '1',
        };
      }
    }

    const resolve = createRequestPrincipalResolver(new CountingAdapter());
    const request = {
      headers: {
        authorization: 'Bearer token',
        'x-correlation-id': 'corr-123',
      },
    } as never;

    await resolve(request);

    expect(calls).toBe(1);
    expect(getRequestPrincipal(request)).toMatchObject({
      accountId: '00000000-0000-0000-0000-000000000001',
    });
  });

  it('does not resolve authentication again when guards consume the principal', async () => {
    let calls = 0;

    class CountingAdapter extends RequestAuthenticationAdapter {
      async authenticate(_input: {
        readonly authorization?: string;
        readonly requestId: string;
      }) {
        calls += 1;
        return {
          accountId: '00000000-0000-0000-0000-000000000001',
          authenticationMethod: 'test',
        };
      }
    }

    const adapter = new CountingAdapter();
    const resolve = createRequestPrincipalResolver(adapter);
    const request = { headers: {} } as never;

    await resolve(request);
    getRequestPrincipal(request);
    getRequestPrincipal(request);

    expect(calls).toBe(1);
  });
});

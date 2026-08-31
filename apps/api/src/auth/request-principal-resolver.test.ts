import { describe, expect, it } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import { RequestPrincipalResolver } from './request-principal-resolver.js';

class StubAuthenticationAdapter extends RequestAuthenticationAdapter {
  constructor(
    private readonly principal:
      | {
          readonly accountId: string;
          readonly authenticationMethod: string;
          readonly verificationLevel?: string;
        }
      | undefined,
  ) {
    super();
  }

  async authenticate() {
    return this.principal;
  }
}

describe('RequestPrincipalResolver', () => {
  it('returns an authenticated principal', async () => {
    const resolver = new RequestPrincipalResolver(
      new StubAuthenticationAdapter({
        accountId: 'account-1',
        authenticationMethod: 'test',
        verificationLevel: '2',
      }),
    );

    await expect(
      resolver.requireAuthenticated({ requestId: 'request-1' }),
    ).resolves.toMatchObject({
      accountId: 'account-1',
      verificationLevel: '2',
    });
  });

  it('rejects an unauthenticated request', async () => {
    const resolver = new RequestPrincipalResolver(
      new StubAuthenticationAdapter(undefined),
    );

    await expect(
      resolver.requireAuthenticated({ requestId: 'request-1' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

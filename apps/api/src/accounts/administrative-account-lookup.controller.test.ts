import { describe, expect, it } from 'vitest';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from '../auth/authentication-adapter.js';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeAccountLookupController } from './administrative-account-lookup.controller.js';

class StubAuthenticationAdapter extends RequestAuthenticationAdapter {
  constructor(private readonly principal: any) { super(); }
  async authenticate() { return this.principal; }
}

describe('administrative account lookup HTTP boundary', () => {
  function controllerFor(principal: any = undefined, allowed = true) {
    const accounts = { findById: async (id: string) => ({ id, status: 'active' }) } as any;
    const capabilities = {
      require: async () => {
        if (!allowed) throw new ForbiddenException('administrative capability is required');
      },
    } as any;
    return new AdministrativeAccountLookupController(
      accounts,
      new RequestPrincipalResolver(new StubAuthenticationAdapter(principal)),
      capabilities,
    );
  }

  it('allows an authenticated principal with lookup capability', async () => {
    await expect(controllerFor({ accountId: 'admin-1', authenticationMethod: 'test' })
      .findById('account-1')).resolves.toMatchObject({ id: 'account-1' });
  });

  it('rejects unauthenticated requests', async () => {
    await expect(controllerFor().findById('account-1')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects principals without the lookup capability', async () => {
    await expect(controllerFor({ accountId: 'user-1', authenticationMethod: 'test' }, false)
      .findById('account-1')).rejects.toBeInstanceOf(ForbiddenException);
  });
});

import { describe, expect, it } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from '../auth/authentication-adapter.js';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AuthenticatedAccountActivationController } from './authenticated-account-activation.controller.js';
import { AuthenticatedAccountActivationService } from './authenticated-account-activation.service.js';

class StubAuthenticationAdapter extends RequestAuthenticationAdapter {
  constructor(private readonly principal: any) { super(); }
  async authenticate() { return this.principal; }
}

describe('authenticated account activation HTTP boundary', () => {
  function controllerFor(principal: any = undefined) {
    const activation = {
      activate: async (value: any) => {
        expect(value).toBe(principal);
        return { accountId: principal.accountId, state: 'active' as const };
      },
    } as unknown as AuthenticatedAccountActivationService;

    return new AuthenticatedAccountActivationController(
      activation,
      new RequestPrincipalResolver(new StubAuthenticationAdapter(principal)),
    );
  }

  it('derives the activation target from the authenticated principal', async () => {
    await expect(controllerFor({
      accountId: 'account-1',
      authenticationMethod: 'test',
    }).activate()).resolves.toEqual({
      accountId: 'account-1',
      state: 'active',
    });
  });

  it('rejects activation when authentication is absent', async () => {
    await expect(controllerFor().activate()).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

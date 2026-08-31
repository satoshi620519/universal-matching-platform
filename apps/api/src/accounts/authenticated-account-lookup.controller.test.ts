import { describe, expect, it } from 'vitest';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from '../auth/authentication-adapter.js';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AuthenticatedAccountLookupController } from './authenticated-account-lookup.controller.js';
import { AccountLookupService } from './account-lookup.service.js';

class StubAuthenticationAdapter extends RequestAuthenticationAdapter {
  constructor(private readonly principal: any) { super(); }
  async authenticate() { return this.principal; }
}

describe('authenticated account lookup HTTP boundary', () => {
  function controllerFor(principal: any = undefined, account: any = {
    id: 'account-1',
    status: 'active',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  }) {
    class Lookup extends AccountLookupService {
      constructor() { super({} as never); }
      override async findById(id: string) {
        expect(id).toBe(principal?.accountId);
        return account;
      }
    }

    return new AuthenticatedAccountLookupController(
      new Lookup(),
      new RequestPrincipalResolver(new StubAuthenticationAdapter(principal)),
    );
  }

  it('uses the authenticated principal account id instead of a client-supplied id', async () => {
    await expect(controllerFor({
      accountId: 'account-1',
      authenticationMethod: 'test',
    }).findAuthenticatedAccount()).resolves.toMatchObject({
      id: 'account-1',
      status: 'active',
    });
  });

  it('returns unauthorized when authentication is absent', async () => {
    await expect(controllerFor().findAuthenticatedAccount()).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns not found when the authenticated account does not exist', async () => {
    await expect(controllerFor({
      accountId: 'missing',
      authenticationMethod: 'test',
    }, null).findAuthenticatedAccount()).rejects.toBeInstanceOf(NotFoundException);
  });
});

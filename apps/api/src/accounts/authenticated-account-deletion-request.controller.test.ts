import { describe, expect, it } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from '../auth/authentication-adapter.js';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AuthenticatedAccountDeletionRequestController } from './authenticated-account-deletion-request.controller.js';
import { AuthenticatedAccountDeletionRequestService } from './authenticated-account-deletion-request.service.js';

class StubAuthenticationAdapter extends RequestAuthenticationAdapter {
  constructor(private readonly principal: any) { super(); }
  async authenticate() { return this.principal; }
}

describe('authenticated account deletion request HTTP boundary', () => {
  function controllerFor(principal: any = undefined) {
    const deletion = {
      requestDeletion: async (value: any) => {
        expect(value).toBe(principal);
        return { accountId: principal.accountId, state: 'pending-deletion' as const };
      },
    } as unknown as AuthenticatedAccountDeletionRequestService;

    return new AuthenticatedAccountDeletionRequestController(
      deletion,
      new RequestPrincipalResolver(new StubAuthenticationAdapter(principal)),
    );
  }

  it('derives the deletion target from the authenticated principal', async () => {
    await expect(controllerFor({
      accountId: 'account-1',
      authenticationMethod: 'test',
    }).requestDeletion()).resolves.toEqual({
      accountId: 'account-1',
      state: 'pending-deletion',
    });
  });

  it('rejects a deletion request when authentication is absent', async () => {
    await expect(controllerFor().requestDeletion()).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

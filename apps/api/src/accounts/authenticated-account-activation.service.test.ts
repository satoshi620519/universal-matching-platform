import { describe, expect, it } from 'vitest';
import { AccountActivationService } from './account-activation.service.js';
import { AuthenticatedAccountActivationService } from './authenticated-account-activation.service.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';

describe('authenticated account activation service', () => {
  const principal = { accountId: 'account-1', authenticationMethod: 'test' } as const;

  it('activates only the account resolved from the authenticated principal', async () => {
    const context = {
      resolve: async (value: typeof principal) => {
        expect(value).toBe(principal);
        return {
          principal,
          account: {
            id: 'account-1',
            status: 'pending-onboarding' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
      },
    } as unknown as AuthenticatedAccountContextService;

    const service = new AuthenticatedAccountActivationService(
      context,
      new AccountActivationService(),
    );

    await expect(service.activate(principal)).resolves.toEqual({
      accountId: 'account-1',
      state: 'active',
    });
  });
});

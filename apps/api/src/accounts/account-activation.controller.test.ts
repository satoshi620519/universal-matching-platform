import { describe, expect, it } from 'vitest';
import { AccountActivationController } from './account-activation.controller.js';
import { AccountActivationService } from './account-activation.service.js';
import { AccountRepository } from './account.repository.js';

describe('account activation API boundary', () => {
  it('activates an existing account through the validated application service', async () => {
    class Repository extends AccountRepository {
      async create() {
        throw new Error('not used');
      }

      async findById() {
        return {
          id: 'account-1',
          status: 'pending' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    const controller = new AccountActivationController(
      new Repository(),
      new AccountActivationService(),
    );

    await expect(controller.activate('account-1', {})).resolves.toEqual({
      accountId: 'account-1',
      state: 'active',
    });
  });

  it('returns not found before attempting activation for an unknown account', async () => {
    class Repository extends AccountRepository {
      async create() {
        throw new Error('not used');
      }

      async findById() {
        return null;
      }
    }

    const controller = new AccountActivationController(
      new Repository(),
      new AccountActivationService(),
    );

    await expect(controller.activate('missing', {})).rejects.toMatchObject({
      status: 404,
    });
  });
});

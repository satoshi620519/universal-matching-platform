import { describe, expect, it, vi } from 'vitest';
import { AccountLookupController } from './account-lookup.controller.js';
import { AccountLookupService } from './account-lookup.service.js';

describe('account lookup HTTP boundary', () => {
  const principal = {
    requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'viewer-1' }),
  };

  it('returns an account through the application service', async () => {
    class Lookup extends AccountLookupService {
      constructor() { super({} as never); }
      override async findById(id: string) {
        expect(id).toBe('account-1');
        return {
          id,
          status: 'active' as const,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        };
      }
    }

    const controller = new AccountLookupController(new Lookup(), principal as never);
    await expect(controller.findById('account-1', 'Bearer token')).resolves.toMatchObject({ id: 'account-1', status: 'active' });
  });

  it('rejects an empty account id', async () => {
    const controller = new AccountLookupController({ findById: async () => null } as never, principal as never);
    await expect(controller.findById('   ')).rejects.toMatchObject({ status: 400 });
  });

  it('returns not found for an unknown account', async () => {
    const controller = new AccountLookupController({ findById: async () => null } as never, principal as never);
    await expect(controller.findById('missing', 'Bearer token')).rejects.toMatchObject({ status: 404 });
  });
});

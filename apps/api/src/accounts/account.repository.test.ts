import { describe, expect, it } from 'vitest';
import type { AccountRepository } from './account.repository.js';

describe('account repository contract', () => {
  it('keeps persistence records independent from Prisma model types', () => {
    const contract: Pick<AccountRepository, 'create' | 'findById'> = {
      create: async () => ({
        id: '00000000-0000-0000-0000-000000000001',
        status: 'pending-onboarding',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findById: async () => null,
    };

    expect(typeof contract.create).toBe('function');
    expect(typeof contract.findById).toBe('function');
  });
});

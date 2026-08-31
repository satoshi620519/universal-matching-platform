import { describe, expect, it, vi } from 'vitest';

import { PrismaSafetyEnforcementRepository } from './prisma-safety-enforcement.repository.js';

describe('PrismaSafetyEnforcementRepository', () => {
  it('queries only currently effective active records', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const database = {
      safetyEnforcement: { findMany },
    } as any;
    const repository = new PrismaSafetyEnforcementRepository(database);
    const now = new Date('2026-08-31T00:00:00.000Z');

    await expect(
      repository.findActiveForAccount('account-1', now),
    ).resolves.toEqual([]);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          accountId: 'account-1',
          status: 'active',
          effectiveAt: { lte: now },
        }),
      }),
    );
  });
});

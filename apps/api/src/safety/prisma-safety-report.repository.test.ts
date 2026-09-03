import { describe, expect, it, vi } from 'vitest';

import { PrismaSafetyReportRepository } from './prisma-safety-report.repository.js';

describe('PrismaSafetyReportRepository', () => {
  it('scopes report reads to the authenticated reporter account', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const database = {
      safetyReport: { findMany },
    } as any;
    const repository = new PrismaSafetyReportRepository(database);

    await expect(repository.listForReporter('reporter-account-1')).resolves.toEqual([]);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { reporterId: 'reporter-account-1' },
      }),
    );
  });
});

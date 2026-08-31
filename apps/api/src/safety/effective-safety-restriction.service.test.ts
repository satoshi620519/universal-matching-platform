import { describe, expect, it, vi } from 'vitest';

import { EffectiveSafetyRestrictionService } from './effective-safety-restriction.service.js';

describe('EffectiveSafetyRestrictionService', () => {
  it('loads authoritative active records before reducing by scope', async () => {
    const findActiveForAccount = vi.fn().mockResolvedValue([
      {
        id: 'enforcement-1',
        accountId: 'account-1',
        restriction: 'communication-restricted',
        reasonCategory: 'policy',
        status: 'active',
        effectiveAt: '2026-08-01T00:00:00.000Z',
      },
    ]);
    const service = new EffectiveSafetyRestrictionService({
      findActiveForAccount,
    } as any);
    const now = new Date('2026-08-31T00:00:00.000Z');

    await expect(
      service.resolveForAccount('account-1', 'communication', now),
    ).resolves.toBe('communication-restricted');

    expect(findActiveForAccount).toHaveBeenCalledWith('account-1', now);
  });
});

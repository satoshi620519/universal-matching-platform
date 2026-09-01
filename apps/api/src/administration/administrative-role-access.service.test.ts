import { describe, expect, it, vi } from 'vitest';

import { AdministrativeRoleAccessService } from './administrative-role-access.service.js';

describe('AdministrativeRoleAccessService', () => {
  it('evaluates roles from the authoritative active-assignment repository', async () => {
    const findActiveForAccount = vi.fn().mockResolvedValue([
      {
        accountId: 'account-1',
        role: 'moderator',
        effectiveAt: '2026-09-01T00:00:00.000Z',
      },
    ]);
    const service = new AdministrativeRoleAccessService({ findActiveForAccount } as any);

    await expect(service.hasRole('account-1', 'moderator')).resolves.toBe(true);
    await expect(service.hasRole('account-1', 'administrator')).resolves.toBe(false);
  });

  it('supports explicit multi-role capability checks', async () => {
    const service = new AdministrativeRoleAccessService({
      findActiveForAccount: vi.fn().mockResolvedValue([
        { accountId: 'a', role: 'auditor', effectiveAt: '2026-09-01T00:00:00.000Z' },
      ]),
    } as any);

    await expect(service.hasAnyRole('a', ['moderator', 'auditor'])).resolves.toBe(true);
  });
});

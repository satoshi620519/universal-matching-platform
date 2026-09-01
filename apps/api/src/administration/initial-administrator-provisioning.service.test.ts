import { describe, expect, it, vi } from 'vitest';

import { InitialAdministratorProvisioningService } from './initial-administrator-provisioning.service.js';

describe('InitialAdministratorProvisioningService', () => {
  it('creates the initial administrator without using runtime role authorization', async () => {
    const assignments = { findActiveForAccount: vi.fn().mockResolvedValue([]), assign: vi.fn() };
    const service = new InitialAdministratorProvisioningService(assignments as any);
    const now = new Date('2026-09-01T00:00:00.000Z');

    await expect(service.provision('account-1', now)).resolves.toBe(true);

    expect(assignments.assign).toHaveBeenCalledWith(expect.objectContaining({
      accountId: 'account-1',
      role: 'administrator',
      effectiveAt: now,
    }));
  });

  it('is idempotent when the target already has an active administrator role', async () => {
    const assignments = {
      findActiveForAccount: vi.fn().mockResolvedValue([{ accountId: 'account-1', role: 'administrator' }]),
      assign: vi.fn(),
    };
    const service = new InitialAdministratorProvisioningService(assignments as any);

    await expect(service.provision('account-1')).resolves.toBe(false);
    expect(assignments.assign).not.toHaveBeenCalled();
  });
});

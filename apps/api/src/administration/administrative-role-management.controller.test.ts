import { describe, expect, it, vi } from 'vitest';

import { AdministrativeRoleManagementController } from './administrative-role-management.controller.js';

describe('AdministrativeRoleManagementController', () => {
  it('resolves principal and forwards validated role assignment input', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({ accountId: 'admin-1' });
    const assign = vi.fn();
    const controller = new AdministrativeRoleManagementController(
      { requireAuthenticated } as any,
      { assign } as any,
    );

    await controller.assign(
      'account-1',
      { role: 'moderator', effectiveAt: '2026-09-01T00:00:00.000Z' },
      'Bearer opaque',
      'request-1',
    );

    expect(requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer opaque', requestId: 'request-1',
    });
    expect(assign).toHaveBeenCalledWith(expect.objectContaining({
      actorId: 'admin-1', accountId: 'account-1', role: 'moderator',
    }));
  });

  it('rejects invalid role and time window before mutation', async () => {
    const assign = vi.fn();
    const controller = new AdministrativeRoleManagementController(
      { requireAuthenticated: vi.fn() } as any,
      { assign } as any,
    );

    await expect(controller.assign('account-1', { role: 'unknown' }, undefined, undefined)).rejects.toThrow('role is invalid');
    await expect(controller.assign('account-1', {
      role: 'moderator',
      effectiveAt: '2026-09-02T00:00:00.000Z',
      expiresAt: '2026-09-01T00:00:00.000Z',
    }, undefined, undefined)).rejects.toThrow('expiresAt must be after effectiveAt');
    expect(assign).not.toHaveBeenCalled();
  });

  it('forwards principal identity and role target for revocation', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({ accountId: 'admin-1' });
    const revoke = vi.fn().mockResolvedValue(true);
    const controller = new AdministrativeRoleManagementController(
      { requireAuthenticated } as any,
      { revoke } as any,
    );

    await expect(controller.revoke('account-1', 'moderator', {}, 'Bearer opaque', 'request-2')).resolves.toEqual({ revoked: true });
    expect(revoke).toHaveBeenCalledWith(expect.objectContaining({
      actorId: 'admin-1', accountId: 'account-1', role: 'moderator',
    }));
  });
});

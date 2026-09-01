import { describe, expect, it, vi } from 'vitest';

import { AdministrativeRoleManagementService } from './administrative-role-management.service.js';

describe('AdministrativeRoleManagementService', () => {
  it('authorizes before mutating role assignments', async () => {
    const require = vi.fn().mockResolvedValue(undefined);
    const assign = vi.fn();
    const service = new AdministrativeRoleManagementService(
      { require } as any,
      { assign } as any,
    );

    await service.assign({
      actorId: 'admin',
      accountId: 'target',
      role: 'moderator',
    });

    expect(require).toHaveBeenCalledWith(
      'admin',
      'manage-administrative-roles',
    );
    expect(assign).toHaveBeenCalled();
  });

  it('does not mutate when authorization fails', async () => {
    const require = vi.fn().mockRejectedValue(new Error('forbidden'));
    const assign = vi.fn();
    const service = new AdministrativeRoleManagementService(
      { require } as any,
      { assign } as any,
    );

    await expect(service.assign({
      actorId: 'a', accountId: 'b', role: 'moderator',
    })).rejects.toThrow('forbidden');
    expect(assign).not.toHaveBeenCalled();
  });
});

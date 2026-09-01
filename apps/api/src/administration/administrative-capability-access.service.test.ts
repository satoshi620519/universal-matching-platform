import { describe, expect, it, vi } from 'vitest';

import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';

describe('AdministrativeCapabilityAccessService', () => {
  it('authorizes only the policy roles for role management', async () => {
    const hasAnyRole = vi.fn().mockResolvedValue(true);
    const service = new AdministrativeCapabilityAccessService({ hasAnyRole } as any);

    await expect(service.can('a', 'manage-administrative-roles')).resolves.toBe(true);
    expect(hasAnyRole).toHaveBeenCalledWith(
      'a',
      ['administrator'],
      expect.any(Date),
    );
  });

  it('rejects actors without the required capability', async () => {
    const service = new AdministrativeCapabilityAccessService({
      hasAnyRole: vi.fn().mockResolvedValue(false),
    } as any);

    await expect(
      service.require('a', 'manage-administrative-roles'),
    ).rejects.toThrow('administrative capability is required');
  });
});

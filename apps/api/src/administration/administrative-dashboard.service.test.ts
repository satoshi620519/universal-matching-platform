import { describe, expect, it, vi } from 'vitest';

import { AdministrativeDashboardService } from './administrative-dashboard.service.js';

describe('AdministrativeDashboardService', () => {
  it('requires the dashboard capability before reading health', async () => {
    const requireCapability = vi.fn().mockRejectedValue(new Error('denied'));
    const health = vi.fn().mockReturnValue({ status: 'ok', database: 'configured' });
    const service = new AdministrativeDashboardService(
      { require: requireCapability } as never,
      { health } as never,
    );

    await expect(service.read('account-1')).rejects.toThrow('denied');
    expect(requireCapability).toHaveBeenCalledWith('account-1', 'view-dashboard');
    expect(health).not.toHaveBeenCalled();
  });

  it('returns only operational dashboard data after authorization', async () => {
    const requireCapability = vi.fn().mockResolvedValue(undefined);
    const health = vi.fn().mockReturnValue({ status: 'ok', database: 'configured' });
    const service = new AdministrativeDashboardService(
      { require: requireCapability } as never,
      { health } as never,
    );

    await expect(service.read('account-1')).resolves.toEqual({
      systemHealth: { status: 'ok', database: 'configured' },
      availableSections: ['dashboard', 'users', 'profiles', 'moderation', 'quick-launch'],
    });
  });
});

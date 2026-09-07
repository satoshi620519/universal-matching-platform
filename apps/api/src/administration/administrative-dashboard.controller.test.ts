import { describe, expect, it, vi } from 'vitest';

import { AdministrativeDashboardController } from './administrative-dashboard.controller.js';

describe('AdministrativeDashboardController', () => {
  it('resolves the authenticated principal before reading the dashboard', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({ accountId: 'admin-1' });
    const read = vi.fn().mockResolvedValue({
      systemHealth: { status: 'ok', database: 'configured' },
      availableSections: ['dashboard', 'moderation', 'quick-launch'],
    });
    const controller = new AdministrativeDashboardController(
      { requireAuthenticated } as never,
      { read } as never,
    );

    await expect(controller.read('Bearer token', 'correlation-1')).resolves.toEqual({
      systemHealth: { status: 'ok', database: 'configured' },
      availableSections: ['dashboard', 'moderation', 'quick-launch'],
    });
    expect(requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer token',
      requestId: 'correlation-1',
    });
    expect(read).toHaveBeenCalledWith('admin-1');
  });

  it('uses a stable request id when no correlation header is supplied', async () => {
    const requireAuthenticated = vi.fn().mockResolvedValue({ accountId: 'admin-1' });
    const read = vi.fn().mockResolvedValue({ systemHealth: { status: 'ok', database: 'configured' }, availableSections: [] });
    const controller = new AdministrativeDashboardController(
      { requireAuthenticated } as never,
      { read } as never,
    );

    await controller.read(undefined, '   ');

    expect(requireAuthenticated).toHaveBeenCalledWith({
      authorization: undefined,
      requestId: 'administration-dashboard-read',
    });
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBrowserAdminDashboardApi } from './browser-admin-dashboard-api';

describe('createBrowserAdminDashboardApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reads the protected dashboard endpoint with browser credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ systemHealth: { status: 'ok', database: 'configured' }, availableSections: ['dashboard'] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(createBrowserAdminDashboardApi().read()).resolves.toEqual({
      systemHealth: { status: 'ok', database: 'configured' },
      availableSections: ['dashboard'],
    });
    expect(fetchMock).toHaveBeenCalledWith('/administration/dashboard', {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
  });

  it('fails safely when the dashboard endpoint rejects the request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(createBrowserAdminDashboardApi().read()).rejects.toThrow('Unable to load dashboard (403).');
  });
});

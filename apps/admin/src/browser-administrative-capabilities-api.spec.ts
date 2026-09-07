import { describe, expect, it, vi } from 'vitest';

import { createBrowserAdministrativeCapabilitiesApi } from './browser-administrative-capabilities-api';

describe('createBrowserAdministrativeCapabilitiesApi', () => {
  it('uses the browser session instead of a build-time authorization secret', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ capabilities: ['manage-moderation', 'manage-quick-launch'] }),
    });

    const api = createBrowserAdministrativeCapabilitiesApi(fetchImpl as any);

    await expect(api.list()).resolves.toEqual(['manage-moderation', 'manage-quick-launch']);
    expect(fetchImpl).toHaveBeenCalledWith(
      '/administration/me/capabilities',
      expect.objectContaining({ credentials: 'include' }),
    );
    expect((fetchImpl.mock.calls[0]?.[1] as RequestInit).headers).toBeUndefined();
  });

  it('rejects failed capability discovery', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => 'forbidden',
    });

    await expect(createBrowserAdministrativeCapabilitiesApi(fetchImpl as any).list()).rejects.toThrow('forbidden');
  });
});

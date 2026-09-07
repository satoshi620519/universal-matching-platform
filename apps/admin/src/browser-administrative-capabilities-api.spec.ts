import { describe, expect, it, vi } from 'vitest';

import { createBrowserAdministrativeCapabilitiesApi } from './browser-administrative-capabilities-api';

describe('createBrowserAdministrativeCapabilitiesApi', () => {
  it('returns the server-authoritative granted capabilities', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ capabilities: ['manage-moderation', 'manage-quick-launch'] }),
    });

    const api = createBrowserAdministrativeCapabilitiesApi(fetchImpl as any);

    await expect(api.list()).resolves.toEqual(['manage-moderation', 'manage-quick-launch']);
    expect(fetchImpl).toHaveBeenCalledWith(
      '/administration/me/capabilities',
      expect.objectContaining({ headers: expect.any(Object) }),
    );
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

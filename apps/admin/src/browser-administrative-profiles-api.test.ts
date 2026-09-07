import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBrowserAdministrativeProfilesApi } from './browser-administrative-profiles-api';

describe('createBrowserAdministrativeProfilesApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests a paginated profile directory with credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], nextCursor: null }) });
    vi.stubGlobal('fetch', fetchMock);
    await createBrowserAdministrativeProfilesApi().list({ cursor: 'after-1', limit: 20 });
    expect(fetchMock).toHaveBeenCalledWith('/administration/profiles?cursor=after-1&limit=20', expect.objectContaining({
      credentials: 'include', headers: expect.objectContaining({ Accept: 'application/json' }),
    }));
  });

  it('surfaces HTTP failures safely', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(createBrowserAdministrativeProfilesApi().list()).rejects.toThrow('Unable to load profiles (403).');
  });
});

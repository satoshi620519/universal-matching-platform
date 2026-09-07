import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBrowserAdministrativeUsersApi } from './browser-administrative-users-api';

describe('createBrowserAdministrativeUsersApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests a paginated user directory with credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], nextCursor: null }) });
    vi.stubGlobal('fetch', fetchMock);

    await createBrowserAdministrativeUsersApi().list({ cursor: 'after-1', limit: 20 });

    expect(fetchMock).toHaveBeenCalledWith('/administration/users?cursor=after-1&limit=20', expect.objectContaining({
      credentials: 'include',
      headers: expect.objectContaining({ Accept: 'application/json' }),
    }));
  });

  it('surfaces HTTP failures safely', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(createBrowserAdministrativeUsersApi().list()).rejects.toThrow('Unable to load users (403).');
  });
});

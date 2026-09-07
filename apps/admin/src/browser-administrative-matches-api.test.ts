import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBrowserAdministrativeMatchesApi } from './browser-administrative-matches-api';

describe('createBrowserAdministrativeMatchesApi', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('requests paginated match interactions with credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], nextCursor: null }) });
    vi.stubGlobal('fetch', fetchMock);
    await createBrowserAdministrativeMatchesApi().list({ cursor: 'm1', limit: 25 });
    expect(fetchMock).toHaveBeenCalledWith('/administration/matches?cursor=m1&limit=25', expect.objectContaining({ credentials: 'include', headers: expect.objectContaining({ Accept: 'application/json' }) }));
  });
});

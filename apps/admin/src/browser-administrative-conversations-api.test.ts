import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBrowserAdministrativeConversationsApi } from './browser-administrative-conversations-api';

describe('createBrowserAdministrativeConversationsApi', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('requests paginated conversation metadata with credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], nextCursor: null }) });
    vi.stubGlobal('fetch', fetchMock);
    await createBrowserAdministrativeConversationsApi().list({ cursor: 'c1', limit: 25 });
    expect(fetchMock).toHaveBeenCalledWith('/administration/conversations?cursor=c1&limit=25', expect.objectContaining({ credentials: 'include' }));
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBrowserAdministrativeModerationApi } from './browser-administrative-moderation-api';

describe('createBrowserAdministrativeModerationApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('loads reports with credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], nextCursor: null }) });
    vi.stubGlobal('fetch', fetchMock);
    await createBrowserAdministrativeModerationApi().listReports({ cursor: 'after-1', limit: 20 });
    expect(fetchMock).toHaveBeenCalledWith('/administration/moderation/reports?cursor=after-1&limit=20', expect.objectContaining({ credentials: 'include' }));
  });

  it('posts report transitions to the existing safety workflow', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
    await createBrowserAdministrativeModerationApi().transitionReport('report-1', 'triaged');
    expect(fetchMock).toHaveBeenCalledWith('/safety/moderation/reports/report-1/transition', expect.objectContaining({ method: 'POST', body: JSON.stringify({ status: 'triaged' }), credentials: 'include' }));
  });

  it('surfaces workflow failures safely', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(createBrowserAdministrativeModerationApi().openCase('report-1')).rejects.toThrow('Unable to update moderation data (403).');
  });
});

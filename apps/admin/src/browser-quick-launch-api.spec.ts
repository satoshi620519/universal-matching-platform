import { describe, expect, it, vi } from 'vitest';
import { createBrowserQuickLaunchApi } from './browser-quick-launch-api.js';

describe('browser Quick Launch API', () => {
  it('sends JSON requests and surfaces API failures', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ version: 1 }) });
    vi.stubGlobal('fetch', fetchMock);
    const api = createBrowserQuickLaunchApi();
    await api.request('/administration/quick-launch/drafts', { method: 'POST', body: { applicationName: 'Demo' } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toContain('/administration/quick-launch/drafts');
    expect(init.headers['content-type']).toBe('application/json');
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBrowserAdministrativeAuditApi } from './browser-administrative-audit-api';

describe('createBrowserAdministrativeAuditApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('loads audit logs with credentials and pagination', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], nextCursor: null }) });
    vi.stubGlobal('fetch', fetchMock);
    await createBrowserAdministrativeAuditApi().list({ cursor: 'after-1', limit: 20 });
    expect(fetchMock).toHaveBeenCalledWith('/administration/audit?cursor=after-1&limit=20', expect.objectContaining({ credentials: 'include' }));
  });

  it('surfaces audit read failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(createBrowserAdministrativeAuditApi().list()).rejects.toThrow('Unable to load audit logs (403).');
  });
});

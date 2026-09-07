import { describe, expect, it, vi } from 'vitest';
import { AdministrativeMatchReadService } from './administrative-match-read.service.js';

describe('AdministrativeMatchReadService', () => {
  it('authorizes reads and clamps the page size', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const matches = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const service = new AdministrativeMatchReadService(access as never, matches as never);
    await service.list({ accountId: 'admin-1', cursor: 'c1', limit: 500 });
    expect(access.require).toHaveBeenCalledWith('admin-1', 'view-dashboard');
    expect(matches.list).toHaveBeenCalledWith({ cursor: 'c1', limit: 100 });
  });
});

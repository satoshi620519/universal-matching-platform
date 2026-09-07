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

  it('does not query interactions when authorization fails', async () => {
    const access = { require: vi.fn().mockRejectedValue(new Error('denied')) };
    const matches = { list: vi.fn() };
    const service = new AdministrativeMatchReadService(access as never, matches as never);
    await expect(service.list({ accountId: 'admin-1' })).rejects.toThrow('denied');
    expect(matches.list).not.toHaveBeenCalled();
  });
});

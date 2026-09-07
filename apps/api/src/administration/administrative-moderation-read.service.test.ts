import { describe, expect, it, vi } from 'vitest';
import { AdministrativeModerationReadService } from './administrative-moderation-read.service.js';

describe('AdministrativeModerationReadService', () => {
  it('authorizes report reads and clamps limits', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const moderation = { listReports: vi.fn().mockResolvedValue({ items: [], nextCursor: null }), listCases: vi.fn() };
    const service = new AdministrativeModerationReadService(access as never, moderation as never);
    await service.listReports({ accountId: 'admin-1', limit: 999 });
    expect(access.require).toHaveBeenCalledWith('admin-1', 'manage-moderation');
    expect(moderation.listReports).toHaveBeenCalledWith({ cursor: undefined, limit: 100 });
  });

  it('uses safe defaults for case reads', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const moderation = { listReports: vi.fn(), listCases: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const service = new AdministrativeModerationReadService(access as never, moderation as never);
    await service.listCases({ accountId: 'admin-1' });
    expect(moderation.listCases).toHaveBeenCalledWith({ cursor: undefined, limit: 25 });
  });
});

import { describe, expect, it, vi } from 'vitest';
import { AdministrativeProfileReadService } from './administrative-profile-read.service.js';

describe('AdministrativeProfileReadService', () => {
  it('requires access and clamps page size', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const profiles = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const service = new AdministrativeProfileReadService(access as never, profiles as never);
    await service.list({ accountId: 'admin-1', limit: 999 });
    expect(access.require).toHaveBeenCalledWith('admin-1', 'view-dashboard');
    expect(profiles.list).toHaveBeenCalledWith({ cursor: undefined, limit: 100 });
  });
});

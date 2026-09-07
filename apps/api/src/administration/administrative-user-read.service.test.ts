import { describe, expect, it, vi } from 'vitest';
import { AdministrativeUserReadService } from './administrative-user-read.service.js';

describe('AdministrativeUserReadService', () => {
  it('requires administrative access and clamps page size', async () => {
    const capabilityAccess = { require: vi.fn().mockResolvedValue(undefined) };
    const users = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const service = new AdministrativeUserReadService(capabilityAccess as never, users as never);

    await service.list({ accountId: 'admin-1', cursor: 'cursor-1', limit: 999 });

    expect(capabilityAccess.require).toHaveBeenCalledWith('admin-1', 'view-dashboard');
    expect(users.list).toHaveBeenCalledWith({ cursor: 'cursor-1', limit: 100 });
  });

  it('uses a safe default page size', async () => {
    const capabilityAccess = { require: vi.fn().mockResolvedValue(undefined) };
    const users = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const service = new AdministrativeUserReadService(capabilityAccess as never, users as never);

    await service.list({ accountId: 'admin-1' });

    expect(users.list).toHaveBeenCalledWith({ cursor: undefined, limit: 25 });
  });
});

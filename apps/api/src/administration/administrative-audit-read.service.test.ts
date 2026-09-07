import { describe, expect, it, vi } from 'vitest';
import { AdministrativeAuditReadService } from './administrative-audit-read.service.js';

describe('AdministrativeAuditReadService', () => {
  it('requires dashboard access and clamps pagination', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const audit = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const service = new AdministrativeAuditReadService(access as never, audit as never);
    await service.list({ accountId: 'admin-1', limit: 999 });
    expect(access.require).toHaveBeenCalledWith('admin-1', 'view-dashboard');
    expect(audit.list).toHaveBeenCalledWith({ cursor: undefined, limit: 100 });
  });

  it('does not query logs when authorization fails', async () => {
    const access = { require: vi.fn().mockRejectedValue(new Error('denied')) };
    const audit = { list: vi.fn() };
    const service = new AdministrativeAuditReadService(access as never, audit as never);
    await expect(service.list({ accountId: 'admin-1' })).rejects.toThrow('denied');
    expect(audit.list).not.toHaveBeenCalled();
  });
});

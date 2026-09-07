import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AdministrativeAuditReadController } from './administrative-audit-read.controller.js';

describe('AdministrativeAuditReadController', () => {
  it('rejects unauthenticated audit reads', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue(null) };
    const audit = { list: vi.fn() };
    const controller = new AdministrativeAuditReadController(principals as never, audit as never);
    await expect(controller.list({} as never)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid limits before querying audit logs', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const audit = { list: vi.fn() };
    const controller = new AdministrativeAuditReadController(principals as never, audit as never);
    await expect(controller.list({} as never, undefined, '0')).rejects.toBeInstanceOf(BadRequestException);
    expect(audit.list).not.toHaveBeenCalled();
  });

  it('passes validated pagination to the audit service', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const audit = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const controller = new AdministrativeAuditReadController(principals as never, audit as never);
    await controller.list({} as never, 'cursor-1', '20');
    expect(audit.list).toHaveBeenCalledWith({ accountId: 'admin-1', cursor: 'cursor-1', limit: 20 });
  });
});

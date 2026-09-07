import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AdministrativeModerationReadController } from './administrative-moderation-read.controller.js';

describe('AdministrativeModerationReadController', () => {
  it('rejects unauthenticated report reads', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue(null) };
    const moderation = { listReports: vi.fn(), listCases: vi.fn() };
    const controller = new AdministrativeModerationReadController(principals as never, moderation as never);
    await expect(controller.reports({} as never)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid pagination before case reads', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const moderation = { listReports: vi.fn(), listCases: vi.fn() };
    const controller = new AdministrativeModerationReadController(principals as never, moderation as never);
    await expect(controller.cases({} as never, undefined, '0')).rejects.toBeInstanceOf(BadRequestException);
    expect(moderation.listCases).not.toHaveBeenCalled();
  });

  it('passes validated pagination to report reads', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const moderation = { listReports: vi.fn().mockResolvedValue({ items: [], nextCursor: null }), listCases: vi.fn() };
    const controller = new AdministrativeModerationReadController(principals as never, moderation as never);
    await controller.reports({} as never, 'cursor-1', '20');
    expect(moderation.listReports).toHaveBeenCalledWith({ accountId: 'admin-1', cursor: 'cursor-1', limit: 20 });
  });
});

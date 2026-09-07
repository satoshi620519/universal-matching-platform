import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AdministrativeMatchReadController } from './administrative-match-read.controller.js';

describe('AdministrativeMatchReadController', () => {
  it('rejects unauthenticated reads', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue(null) };
    const matches = { list: vi.fn() };
    const controller = new AdministrativeMatchReadController(principals as never, matches as never);
    await expect(controller.list({} as never)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid limits before repository access', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const matches = { list: vi.fn() };
    const controller = new AdministrativeMatchReadController(principals as never, matches as never);
    await expect(controller.list({} as never, undefined, '0')).rejects.toBeInstanceOf(BadRequestException);
    expect(matches.list).not.toHaveBeenCalled();
  });

  it('passes authenticated principal and validated pagination to the service', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const matches = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const controller = new AdministrativeMatchReadController(principals as never, matches as never);
    await controller.list({} as never, 'cursor-1', '20');
    expect(matches.list).toHaveBeenCalledWith({ accountId: 'admin-1', cursor: 'cursor-1', limit: 20 });
  });
});

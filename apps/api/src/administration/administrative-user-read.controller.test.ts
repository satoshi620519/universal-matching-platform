import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AdministrativeUserReadController } from './administrative-user-read.controller.js';

describe('AdministrativeUserReadController', () => {
  it('rejects unauthenticated requests', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue(null) };
    const users = { list: vi.fn() };
    const controller = new AdministrativeUserReadController(principals as never, users as never);

    await expect(controller.list({} as never)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid limits before reading users', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const users = { list: vi.fn() };
    const controller = new AdministrativeUserReadController(principals as never, users as never);

    await expect(controller.list({} as never, undefined, '0')).rejects.toBeInstanceOf(BadRequestException);
    expect(users.list).not.toHaveBeenCalled();
  });

  it('passes validated query parameters to the service', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const users = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const controller = new AdministrativeUserReadController(principals as never, users as never);

    await controller.list({} as never, 'cursor-1', '20');

    expect(users.list).toHaveBeenCalledWith({ accountId: 'admin-1', cursor: 'cursor-1', limit: 20 });
  });
});

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AdministrativeProfileReadController } from './administrative-profile-read.controller.js';

describe('AdministrativeProfileReadController', () => {
  it('rejects unauthenticated requests', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue(null) };
    const profiles = { list: vi.fn() };
    const controller = new AdministrativeProfileReadController(principals as never, profiles as never);
    await expect(controller.list({} as never)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid limits', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const profiles = { list: vi.fn() };
    const controller = new AdministrativeProfileReadController(principals as never, profiles as never);
    await expect(controller.list({} as never, undefined, '0')).rejects.toBeInstanceOf(BadRequestException);
    expect(profiles.list).not.toHaveBeenCalled();
  });

  it('passes validated pagination to the service', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const profiles = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const controller = new AdministrativeProfileReadController(principals as never, profiles as never);
    await controller.list({} as never, 'cursor-1', '20');
    expect(profiles.list).toHaveBeenCalledWith({ accountId: 'admin-1', cursor: 'cursor-1', limit: 20 });
  });
});

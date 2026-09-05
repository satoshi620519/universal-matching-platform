import { describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { UserBlockController } from './user-block.controller.js';

describe('UserBlockController', () => {
  const principalResolver = {
    requireAuthenticated: vi.fn().mockResolvedValue({ accountId: '11111111-1111-4111-8111-111111111111' }),
  };
  const blocks = {
    create: vi.fn(),
    remove: vi.fn(),
  };

  it('uses the authenticated principal as the blocker identity', async () => {
    blocks.create.mockResolvedValue({ blockerAccountId: '11111111-1111-4111-8111-111111111111', blockedAccountId: '22222222-2222-4222-8222-222222222222' });
    const controller = new UserBlockController(principalResolver as never, blocks as never);

    await controller.block(' 22222222-2222-4222-8222-222222222222 ', 'Bearer token', 'req-1');

    expect(principalResolver.requireAuthenticated).toHaveBeenCalledWith({ authorization: 'Bearer token', requestId: 'req-1' });
    expect(blocks.create).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222');
  });

  it('uses the authenticated principal for directed unblock', async () => {
    blocks.remove.mockResolvedValue(true);
    const controller = new UserBlockController(principalResolver as never, blocks as never);

    const result = await controller.unblock(' 22222222-2222-4222-8222-222222222222 ', 'Bearer token');

    expect(blocks.remove).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222');
    expect(result).toEqual({ statusCode: 200, removed: true });
  });

  it('rejects unblock when the directed block does not exist', async () => {
    blocks.remove.mockResolvedValue(false);
    const controller = new UserBlockController(principalResolver as never, blocks as never);

    await expect(controller.unblock('22222222-2222-4222-8222-222222222222', 'Bearer token')).rejects.toBeInstanceOf(NotFoundException);
  });
});

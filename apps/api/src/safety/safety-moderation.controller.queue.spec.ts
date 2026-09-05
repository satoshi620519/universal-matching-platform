import { describe, expect, it, vi } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { SafetyModerationController } from './safety-moderation.controller.js';

describe('SafetyModerationController moderation queue', () => {
  const controller = (moderation: unknown) => new SafetyModerationController(
    { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'admin-1' }) } as never,
    moderation as never,
    { require: vi.fn().mockResolvedValue(undefined) } as never,
  );

  it('passes authenticated actor and validated filters to the queue service', async () => {
    const moderation = { listModerationQueue: vi.fn().mockResolvedValue([]) };
    await controller(moderation).queue('triaged', '50', 'Bearer token', 'corr-1');
    expect(moderation.listModerationQueue).toHaveBeenCalledWith({ actorId: 'admin-1', status: 'triaged', limit: 50 });
  });

  it('rejects unsupported statuses and out-of-range limits', async () => {
    const moderation = { listModerationQueue: vi.fn() };
    await expect(controller(moderation).queue('actioned', undefined, 'Bearer token')).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller(moderation).queue('submitted', '101', 'Bearer token')).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller(moderation).queue('submitted', '0', 'Bearer token')).rejects.toBeInstanceOf(BadRequestException);
  });
});

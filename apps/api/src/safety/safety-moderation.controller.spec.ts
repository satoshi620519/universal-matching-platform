import { describe, expect, it, vi } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import { SafetyModerationController } from './safety-moderation.controller.js';

const principal = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'admin-1' }) };
const moderation = { listModerationQueue: vi.fn().mockResolvedValue([]), transitionReport: vi.fn(), openCase: vi.fn(), transitionCase: vi.fn(), applyAction: vi.fn() };

describe('SafetyModerationController administrative authorization', () => {
  it('denies moderation queue when moderation.read is absent', async () => {
    const capabilities = { require: vi.fn().mockRejectedValue(new ForbiddenException()) };
    const controller = new SafetyModerationController(principal as never, moderation as never, capabilities as never);
    await expect(controller.queue(undefined, undefined, 'Bearer token')).rejects.toBeInstanceOf(ForbiddenException);
    expect(moderation.listModerationQueue).not.toHaveBeenCalled();
  });

  it('requires moderation.decide before privileged action reaches the domain service', async () => {
    const capabilities = { require: vi.fn().mockRejectedValue(new ForbiddenException()) };
    const controller = new SafetyModerationController(principal as never, moderation as never, capabilities as never);
    await expect(controller.openCase('case-report', 'Bearer token')).rejects.toBeInstanceOf(ForbiddenException);
    expect(capabilities.require).toHaveBeenCalledWith('admin-1', 'moderation.decide');
    expect(moderation.openCase).not.toHaveBeenCalled();
  });

  it('allows an authorized moderator to reach the queue service', async () => {
    const capabilities = { require: vi.fn().mockResolvedValue(undefined) };
    const controller = new SafetyModerationController(principal as never, moderation as never, capabilities as never);
    await controller.queue('submitted', '10', 'Bearer token');
    expect(capabilities.require).toHaveBeenCalledWith('admin-1', 'moderation.read');
    expect(moderation.listModerationQueue).toHaveBeenCalledTimes(1);
  });
});

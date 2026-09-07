import { describe, expect, it, vi } from 'vitest';
import { BadRequestException, HttpException } from '@nestjs/common';
import { SafetyModerationController } from './safety-moderation.controller.js';

describe('SafetyModerationController', () => {
  const principal = {
    requireAuthenticated: vi.fn().mockResolvedValue({ accountId: '11111111-1111-4111-8111-111111111111' }),
  };
  const moderation = {
    submitReport: vi.fn().mockResolvedValue({ id: 'report-1' }),
    listMyReports: vi.fn(),
    transitionReport: vi.fn(),
    openCase: vi.fn(),
    transitionCase: vi.fn(),
    applyAction: vi.fn(),
  };
  const limiter = {
    consume: vi.fn().mockReturnValue({ allowed: true, remaining: 4, retryAfterMs: 0 }),
  };

  it('derives reporter identity from the authenticated principal and rate-limits by account', async () => {
    const controller = new SafetyModerationController(principal as never, moderation as never, limiter as never);

    await controller.submit(
      { targetId: 'target-1', targetType: 'user', reason: ' abuse ' },
      'Bearer token',
      'corr-1',
    );

    expect(principal.requireAuthenticated).toHaveBeenCalledWith({ authorization: 'Bearer token', requestId: 'corr-1' });
    expect(limiter.consume).toHaveBeenCalledWith(
      'safety-report:11111111-1111-4111-8111-111111111111',
      { limit: 5, windowMs: 10 * 60_000 },
    );
    expect(moderation.submitReport).toHaveBeenCalledWith({
      reporterId: '11111111-1111-4111-8111-111111111111',
      targetId: 'target-1',
      targetType: 'user',
      reason: ' abuse ',
    });
  });

  it('rejects the sixth report when the account rate limit is exhausted', async () => {
    limiter.consume.mockReturnValue({ allowed: false, remaining: 0, retryAfterMs: 60_000 });
    const controller = new SafetyModerationController(principal as never, moderation as never, limiter as never);

    await expect(controller.submit({ targetId: 'target-1', targetType: 'user', reason: 'abuse' }, 'Bearer token'))
      .rejects.toBeInstanceOf(HttpException);
    await expect(controller.submit({ targetId: 'target-1', targetType: 'user', reason: 'abuse' }, 'Bearer token'))
      .rejects.toMatchObject({ response: 'Report submission temporarily unavailable', status: 429 });
    expect(moderation.submitReport).not.toHaveBeenCalled();
  });

  it('keeps report target validation before persistence', async () => {
    const controller = new SafetyModerationController(principal as never, moderation as never, limiter as never);

    await expect(controller.submit({ targetId: '', targetType: 'user', reason: 'abuse' }, 'Bearer token'))
      .rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.submit({ targetId: 'target-1', targetType: 'invalid', reason: 'abuse' }, 'Bearer token'))
      .rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.submit({ targetId: 'target-1', targetType: 'user', reason: ' ' }, 'Bearer token'))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(moderation.submitReport).not.toHaveBeenCalled();
  });

  it('derives moderation actor identity from the authenticated principal', async () => {
    const controller = new SafetyModerationController(principal as never, moderation as never, limiter as never);
    moderation.transitionReport.mockResolvedValue({ id: 'report-1' });

    await controller.transitionReport('report-1', { status: 'triaged' }, 'Bearer token', 'corr-2');

    expect(moderation.transitionReport).toHaveBeenCalledWith({
      actorId: '11111111-1111-4111-8111-111111111111',
      reportId: 'report-1',
      status: 'triaged',
      correlationId: 'corr-2',
    });
  });
});

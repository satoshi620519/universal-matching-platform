import { describe, expect, it, vi } from 'vitest';
import { SafetyReportController } from './safety-report.controller.js';

describe('SafetyReportController', () => {
  it('derives reporter identity from the authenticated principal', async () => {
    const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'reporter-1' }) };
    const moderation = { submitReport: vi.fn().mockResolvedValue({ id: 'report-1' }), listMyReports: vi.fn() };
    const controller = new SafetyReportController(principalResolver as never, moderation as never);
    await controller.submit({ targetId: 'target-1', targetType: 'user', reason: 'abuse' }, 'Bearer token', 'req-1');
    expect(principalResolver.requireAuthenticated).toHaveBeenCalledWith({ authorization: 'Bearer token', requestId: 'req-1' });
    expect(moderation.submitReport).toHaveBeenCalledWith({ reporterId: 'reporter-1', targetId: 'target-1', targetType: 'user', reason: 'abuse' });
  });

  it('lists reports only for the authenticated reporter', async () => {
    const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'reporter-1' }) };
    const moderation = { submitReport: vi.fn(), listMyReports: vi.fn().mockResolvedValue([]) };
    const controller = new SafetyReportController(principalResolver as never, moderation as never);
    await controller.listMine('Bearer token', 'req-2');
    expect(moderation.listMyReports).toHaveBeenCalledWith('reporter-1');
  });
});

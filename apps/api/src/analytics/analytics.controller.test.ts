import { describe, expect, it, vi } from 'vitest';
import { AnalyticsController } from './analytics.controller.js';

describe('AnalyticsController', () => {
  const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'admin-1' }) };
  const events = { listRecent: vi.fn().mockResolvedValue([]) };
  const business = { reportEventCounts: vi.fn().mockResolvedValue([]) };
  const safety = { reportByTargetType: vi.fn().mockResolvedValue([]) };
  const controller = new AnalyticsController(principalResolver as never, events as never, business as never, safety as never);

  it('routes business metrics by authenticated principal and period', async () => {
    await controller.businessMetrics('month');
    expect(business.reportEventCounts).toHaveBeenCalledWith('admin-1', 'month');
  });

  it('routes safety metrics by authenticated principal and period', async () => {
    await controller.safetyMetrics('week');
    expect(safety.reportByTargetType).toHaveBeenCalledWith('admin-1', 'week');
  });

  it('rejects unsupported periods', async () => {
    await expect(controller.businessMetrics('forever')).rejects.toThrow('Unsupported reporting period');
  });
});

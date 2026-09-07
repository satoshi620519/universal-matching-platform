import { describe, expect, it, vi } from 'vitest';
import { AnalyticsController } from './analytics.controller.js';

describe('AnalyticsController', () => {
  const principal = { accountId: 'admin-1' };
  const events = { listRecent: vi.fn().mockResolvedValue([]) };
  const business = { reportEventCounts: vi.fn().mockResolvedValue([]) };
  const safety = { reportByTargetType: vi.fn().mockResolvedValue([]) };
  const controller = new AnalyticsController(events as never, business as never, safety as never);

  it('routes business metrics by period for the authenticated administrator', async () => {
    await controller.businessMetrics(principal, 'month');
    expect(business.reportEventCounts).toHaveBeenCalledWith('admin-1', 'month');
  });

  it('routes safety metrics by period for the authenticated administrator', async () => {
    await controller.safetyMetrics(principal, 'week');
    expect(safety.reportByTargetType).toHaveBeenCalledWith('admin-1', 'week');
  });

  it('rejects unsupported periods', () => {
    expect(() => controller.businessMetrics(principal, 'forever')).toThrow('Unsupported reporting period');
  });
});

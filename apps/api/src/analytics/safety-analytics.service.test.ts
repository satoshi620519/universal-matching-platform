import { describe, expect, it } from 'vitest';
import { SafetyAnalyticsService } from './safety-analytics.service.js';
import { SafetyReportRepository } from '../safety/safety-report.repository.js';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';

describe('SafetyAnalyticsService', () => {
  it('returns privacy-preserving aggregate counts', async () => {
    const repository = { listRecentForAnalytics: async () => [{ targetType: 'user' }, { targetType: 'user' }, { targetType: 'message' }] } as unknown as SafetyReportRepository;
    const capabilities = { require: async () => undefined } as unknown as AdministrativeCapabilityAccessService;
    const service = new SafetyAnalyticsService(repository, capabilities);
    await expect(service.reportByTargetType('admin-1', 'week', new Date('2026-09-07T00:00:00Z'))).resolves.toEqual([
      { metricName: 'safety_reports_message', metricVersion: 1, period: 'week', scope: 'global', availability: 'available', value: 1 },
      { metricName: 'safety_reports_user', metricVersion: 1, period: 'week', scope: 'global', availability: 'available', value: 2 },
    ]);
  });
});

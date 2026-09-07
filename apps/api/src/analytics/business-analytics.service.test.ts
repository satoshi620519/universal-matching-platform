import { describe, expect, it } from 'vitest';
import { BusinessAnalyticsService } from './business-analytics.service.js';
import { AnalyticsEventRepository } from './analytics-event.repository.js';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';

describe('BusinessAnalyticsService', () => {
  it('aggregates business events within the requested period', async () => {
    const events = { listSince: async () => [
      { name: 'match_created', version: 1, occurredAt: new Date('2026-09-06T00:00:00Z'), dataClassification: 'business', payload: {} },
      { name: 'match_created', version: 1, occurredAt: new Date('2026-09-05T00:00:00Z'), dataClassification: 'business', payload: {} },
      { name: 'operational_ping', version: 1, occurredAt: new Date('2026-09-06T00:00:00Z'), dataClassification: 'operational', payload: {} },
    ] } as unknown as AnalyticsEventRepository;
    const capabilities = { require: async () => undefined } as unknown as AdministrativeCapabilityAccessService;
    const service = new BusinessAnalyticsService(events, capabilities);
    await expect(service.reportEventCounts('admin', 'week', new Date('2026-09-07T00:00:00Z'))).resolves.toEqual([
      { metricName: 'matches', metricVersion: 1, period: 'week', scope: 'global', availability: 'available', value: 2 },
    ]);
  });
});

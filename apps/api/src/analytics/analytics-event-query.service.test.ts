import { describe, expect, it } from 'vitest';
import { AnalyticsEventQueryService } from './analytics-event-query.service.js';
import { AnalyticsEventRepository } from './analytics-event.repository.js';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';

describe('AnalyticsEventQueryService', () => {
  it('requires analytics access and bounds retrieval size', async () => {
    const limits: number[] = [];
    const events = { listRecent: async (limit: number) => { limits.push(limit); return []; } } as unknown as AnalyticsEventRepository;
    const capabilities = { require: async () => undefined } as unknown as AdministrativeCapabilityAccessService;
    const service = new AnalyticsEventQueryService(events, capabilities);
    await service.listRecent('admin-1', 999);
    expect(limits).toEqual([100]);
  });
});

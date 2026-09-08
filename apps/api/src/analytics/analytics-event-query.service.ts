import { Injectable } from '@nestjs/common';
import { type AnalyticsEventRecord } from '@universal/domain';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';
import { AnalyticsEventRepository } from './analytics-event.repository.js';

@Injectable()
export class AnalyticsEventQueryService {
  constructor(
    private readonly events: AnalyticsEventRepository,
    private readonly capabilities: AdministrativeCapabilityAccessService,
  ) {}

  async listRecent(accountId: string, limit = 100, now = new Date()): Promise<readonly AnalyticsEventRecord[]> {
    await this.capabilities.require(accountId, 'view-analytics', now);
    const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
    const events = await this.events.listRecent(boundedLimit);
    return events.map(({ payload: _payload, ...event }) => event);
  }
}

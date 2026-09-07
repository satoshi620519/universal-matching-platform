import { Injectable } from '@nestjs/common';
import { type MetricReport, type ReportingPeriod } from '@universal/domain';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';
import { AnalyticsEventRepository } from './analytics-event.repository.js';
import { analyticsMetricDefinitions } from './analytics-metric-definitions.js';

@Injectable()
export class BusinessAnalyticsService {
  constructor(
    private readonly events: AnalyticsEventRepository,
    private readonly capabilities: AdministrativeCapabilityAccessService,
  ) {}

  async reportEventCounts(accountId: string, period: ReportingPeriod, now = new Date()): Promise<readonly MetricReport[]> {
    await this.capabilities.require(accountId, 'view-analytics', now);
    const since = this.periodStart(period, now);
    const events = await this.events.listSince(since);
    const counts = events
      .filter(event => event.occurredAt >= since && event.dataClassification === 'business')
      .reduce<Record<string, number>>((result, event) => {
        result[event.name] = (result[event.name] ?? 0) + 1;
        return result;
      }, {});
    const productEventNames = new Set(analyticsMetricDefinitions.flatMap(definition => definition.sourceEvents));
    return Object.keys(counts).filter(name => productEventNames.has(name)).sort().map(name => ({
      metricName: analyticsMetricDefinitions.find(definition => definition.sourceEvents.includes(name))!.name,
      metricVersion: 1,
      period,
      scope: 'global',
      availability: 'available' as const,
      value: counts[name],
    }));
  }

  private periodStart(period: ReportingPeriod, now: Date): Date {
    const start = new Date(now);
    if (period === 'day') start.setUTCDate(start.getUTCDate() - 1);
    else if (period === 'week') start.setUTCDate(start.getUTCDate() - 7);
    else if (period === 'month') start.setUTCMonth(start.getUTCMonth() - 1);
    else if (period === 'quarter') start.setUTCMonth(start.getUTCMonth() - 3);
    else start.setUTCFullYear(start.getUTCFullYear() - 1);
    return start;
  }
}

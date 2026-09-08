import { Injectable } from '@nestjs/common';
import { resolveReportPrivacyControl, type MetricReport, type ReportingPeriod } from '@universal/domain';
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
    const relevantEvents = events.filter(event => event.occurredAt >= since && event.dataClassification === 'business');
    const counts = relevantEvents.reduce<Record<string, number>>((result, event) => {
      result[event.name] = (result[event.name] ?? 0) + 1;
      return result;
    }, {});
    const activeAccountIds = new Set(relevantEvents.filter(event => event.name === 'activity').map(event => event.payload.accountId).filter((accountId): accountId is string => typeof accountId === 'string'));
    return analyticsMetricDefinitions.map(definition => {
      const value = definition.sourceEvents.includes('activity') ? activeAccountIds.size : definition.sourceEvents.reduce((total, name) => total + (counts[name] ?? 0), 0);
      const privacy = resolveReportPrivacyControl({ cohortSize: value, minimumCohortSize: 5, containsSensitiveData: definition.scope === 'safety' });
      return privacy === 'visible'
        ? { metricName: definition.name, metricVersion: definition.version, period, scope: 'global' as const, availability: 'available' as const, value }
        : { metricName: definition.name, metricVersion: definition.version, period, scope: 'global' as const, availability: 'unavailable' as const };
    });
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

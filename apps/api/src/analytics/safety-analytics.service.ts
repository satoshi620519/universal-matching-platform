import { Injectable } from '@nestjs/common';
import { countSafetyReportsByKind, resolveReportPrivacyControl, type MetricReport, type ReportingPeriod } from '@universal/domain';
import { SafetyReportRepository } from '../safety/safety-report.repository.js';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';

@Injectable()
export class SafetyAnalyticsService {
  constructor(
    private readonly reports: SafetyReportRepository,
    private readonly capabilities: AdministrativeCapabilityAccessService,
  ) {}

  async reportByTargetType(accountId: string, period: ReportingPeriod, now = new Date()): Promise<readonly MetricReport[]> {
    await this.capabilities.require(accountId, 'view-analytics', now);
    const since = this.periodStart(period, now);
    const reports = await this.reports.listRecentForAnalytics(since);
    const counts = countSafetyReportsByKind(reports);
    return Object.keys(counts).sort().map(targetType => {
      const value = counts[targetType];
      const privacy = resolveReportPrivacyControl({ cohortSize: value, minimumCohortSize: 5, containsSensitiveData: false });
      return privacy === 'visible'
        ? { metricName: `safety_reports_${targetType}`, metricVersion: 1, period, scope: 'global' as const, availability: 'available' as const, value }
        : { metricName: `safety_reports_${targetType}`, metricVersion: 1, period, scope: 'global' as const, availability: 'unavailable' as const };
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

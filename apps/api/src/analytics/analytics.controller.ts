import { Controller, Get, Param, Query } from '@nestjs/common';
import { type ReportingPeriod } from '@universal/domain';
import { Principal } from '../auth/request-principal.decorator.js';
import { AnalyticsEventQueryService } from './analytics-event-query.service.js';
import { BusinessAnalyticsService } from './business-analytics.service.js';
import { SafetyAnalyticsService } from './safety-analytics.service.js';

const periods = new Set<ReportingPeriod>(['day', 'week', 'month', 'quarter', 'year']);

@Controller('admin/analytics')
export class AnalyticsController {
  constructor(
    private readonly events: AnalyticsEventQueryService,
    private readonly business: BusinessAnalyticsService,
    private readonly safety: SafetyAnalyticsService,
  ) {}

  @Get('events')
  listRecent(@Principal() principal: { accountId: string }, @Query('limit') limit?: string) {
    return this.events.listRecent(principal.accountId, limit === undefined ? 100 : Number(limit));
  }

  @Get('business/:period')
  businessMetrics(@Principal() principal: { accountId: string }, @Param('period') period: string) {
    return this.business.reportEventCounts(principal.accountId, this.period(period));
  }

  @Get('safety/:period')
  safetyMetrics(@Principal() principal: { accountId: string }, @Param('period') period: string) {
    return this.safety.reportByTargetType(principal.accountId, this.period(period));
  }

  private period(value: string): ReportingPeriod {
    if (!periods.has(value as ReportingPeriod)) throw new Error('Unsupported reporting period');
    return value as ReportingPeriod;
  }
}

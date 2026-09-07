import { BadRequestException, Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { type ReportingPeriod } from '@universal/domain';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AnalyticsEventQueryService } from './analytics-event-query.service.js';
import { BusinessAnalyticsService } from './business-analytics.service.js';
import { SafetyAnalyticsService } from './safety-analytics.service.js';

const periods = new Set<ReportingPeriod>(['day', 'week', 'month', 'quarter', 'year']);

@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly principalResolver: RequestPrincipalResolver, private readonly events: AnalyticsEventQueryService, private readonly business: BusinessAnalyticsService, private readonly safety: SafetyAnalyticsService) {}

  @Get('events')
  async listRecent(@Query('limit') limit: string | undefined, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationHeader?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: correlationHeader?.trim() || 'admin-analytics-events' });
    return this.events.listRecent(principal.accountId, limit === undefined ? 100 : Number(limit));
  }

  @Get('business/:period')
  async businessMetrics(@Param('period') period: string, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationHeader?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: correlationHeader?.trim() || 'admin-analytics-business' });
    return this.business.reportEventCounts(principal.accountId, this.period(period));
  }

  @Get('safety/:period')
  async safetyMetrics(@Param('period') period: string, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationHeader?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: correlationHeader?.trim() || 'admin-analytics-safety' });
    return this.safety.reportByTargetType(principal.accountId, this.period(period));
  }

  private period(value: string): ReportingPeriod {
    if (!periods.has(value as ReportingPeriod)) throw new BadRequestException('Unsupported reporting period');
    return value as ReportingPeriod;
  }
}

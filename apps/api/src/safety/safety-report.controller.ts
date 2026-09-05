import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import type { ReportTargetType } from '@universal/domain';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { SafetyModerationService } from './safety-moderation.service.js';

@Controller('reports')
export class SafetyReportController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly moderation: SafetyModerationService,
  ) {}

  @Post()
  async submit(
    @Body() body: { targetId?: string; targetType?: ReportTargetType; reason?: string },
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'safety-report-submit',
    });
    return {
      report: await this.moderation.submitReport({
        reporterId: principal.accountId,
        targetId: body.targetId ?? '',
        targetType: body.targetType ?? 'user',
        reason: body.reason ?? '',
      }),
    };
  }

  @Get('me')
  async listMine(
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'safety-report-list',
    });
    return { reports: await this.moderation.listMyReports(principal.accountId) };
  }
}

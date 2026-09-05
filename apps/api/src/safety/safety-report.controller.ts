import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import type { ReportEvidenceKind, ReportTargetType } from '@universal/domain';
import { randomUUID } from 'node:crypto';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { RequestRateLimiter } from '../common/rate-limit/request-rate-limiter.js';
import { SafetyModerationService } from './safety-moderation.service.js';

@Controller('reports')
export class SafetyReportController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly moderation: SafetyModerationService,
    private readonly limiter: RequestRateLimiter,
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
    this.consumeReportQuota(principal.accountId);
    return {
      report: await this.moderation.submitReport({
        reporterId: principal.accountId,
        targetId: body.targetId ?? '',
        targetType: body.targetType ?? 'user',
        reason: body.reason ?? '',
      }),
    };
  }

  @Post(':reportId/evidence')
  async captureEvidence(
    @Body() body: { kind?: ReportEvidenceKind; context?: string; reference?: string | null; capturedAt?: string },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-request-id') requestId: string | undefined,
    @Param('reportId') reportId: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'report-evidence-capture' });
    this.consumeEvidenceQuota(principal.accountId);
    return { evidence: await this.moderation.captureReportEvidence({ reporterId: principal.accountId, reportId, id: randomUUID(), kind: body.kind ?? 'text-context', context: body.context ?? '', reference: body.reference, capturedAt: body.capturedAt }) };
  }

  private consumeReportQuota(accountId: string): void {
    const decision = this.limiter.consume(`safety-report:${accountId}`, { limit: 10, windowMs: 60_000 });
    if (!decision.allowed) throw new HttpException('Report submission temporarily unavailable', HttpStatus.TOO_MANY_REQUESTS);
  }

  private consumeEvidenceQuota(accountId: string): void {
    const decision = this.limiter.consume(`report-evidence:${accountId}`, { limit: 30, windowMs: 60_000 });
    if (!decision.allowed) throw new HttpException('Evidence submission temporarily unavailable', HttpStatus.TOO_MANY_REQUESTS);
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

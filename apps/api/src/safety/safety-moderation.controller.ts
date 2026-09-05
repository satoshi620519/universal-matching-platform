import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import type { ModerationActionType, ModerationCaseStatus, ReportStatus, ReportTargetType } from '@universal/domain';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { SafetyModerationService } from './safety-moderation.service.js';

const targetTypes = new Set<ReportTargetType>(['user', 'content', 'message']);
const reportStatuses = new Set<ReportStatus>(['submitted', 'triaged', 'actioned', 'dismissed']);
const caseStatuses = new Set<ModerationCaseStatus>(['under-review', 'actioned', 'closed']);
const actions = new Set<ModerationActionType>(['warning', 'restrict-features', 'restrict-communication', 'suspend', 'close-without-action']);

@Controller('safety')
export class SafetyModerationController {
  constructor(private readonly principal: RequestPrincipalResolver, private readonly moderation: SafetyModerationService) {}

  @Post('reports')
  async submit(@Body() body: { targetId?: unknown; targetType?: unknown; reason?: unknown }, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.principal.requireAuthenticated({ authorization, requestId: correlationId ?? 'safety-report-submit' });
    if (typeof body?.targetId !== 'string' || !body.targetId.trim()) throw new BadRequestException('targetId is required');
    if (typeof body?.targetType !== 'string' || !targetTypes.has(body.targetType as ReportTargetType)) throw new BadRequestException('targetType is invalid');
    if (typeof body?.reason !== 'string' || !body.reason.trim()) throw new BadRequestException('reason is required');
    return this.moderation.submitReport({ reporterId: principal.accountId, targetId: body.targetId, targetType: body.targetType as ReportTargetType, reason: body.reason });
  }

  @Get('reports')
  async mine(@Query('limit') limit: string | undefined, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.principal.requireAuthenticated({ authorization, requestId: correlationId ?? 'safety-report-list' });
    const parsed = limit === undefined ? undefined : Number(limit);
    if (parsed !== undefined && (!Number.isInteger(parsed) || parsed < 1)) throw new BadRequestException('limit is invalid');
    return this.moderation.listMyReports(principal.accountId, parsed);
  }

  @Post('moderation/reports/:reportId/transition')
  async transitionReport(@Param('reportId') reportId: string, @Body() body: { status?: unknown }, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.principal.requireAuthenticated({ authorization, requestId: correlationId ?? 'moderation-report-transition' });
    if (typeof body?.status !== 'string' || !reportStatuses.has(body.status as ReportStatus)) throw new BadRequestException('status is invalid');
    return this.moderation.transitionReport({ actorId: principal.accountId, reportId, status: body.status as ReportStatus, ...(correlationId ? { correlationId } : {}) });
  }

  @Post('moderation/reports/:reportId/case')
  async openCase(@Param('reportId') reportId: string, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.principal.requireAuthenticated({ authorization, requestId: correlationId ?? 'moderation-case-open' });
    return this.moderation.openCase({ actorId: principal.accountId, reportId, ...(correlationId ? { correlationId } : {}) });
  }

  @Post('moderation/cases/:caseId/transition')
  async transitionCase(@Param('caseId') caseId: string, @Body() body: { status?: unknown }, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.principal.requireAuthenticated({ authorization, requestId: correlationId ?? 'moderation-case-transition' });
    if (typeof body?.status !== 'string' || !caseStatuses.has(body.status as ModerationCaseStatus)) throw new BadRequestException('status is invalid');
    return this.moderation.transitionCase({ actorId: principal.accountId, caseId, status: body.status as ModerationCaseStatus, ...(correlationId ? { correlationId } : {}) });
  }

  @Post('moderation/cases/:caseId/actions')
  async action(@Param('caseId') caseId: string, @Body() body: { targetId?: unknown; action?: unknown; reasonCategory?: unknown; expiresAt?: unknown }, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.principal.requireAuthenticated({ authorization, requestId: correlationId ?? 'moderation-action' });
    if (typeof body?.targetId !== 'string' || !body.targetId.trim()) throw new BadRequestException('targetId is required');
    if (typeof body?.action !== 'string' || !actions.has(body.action as ModerationActionType)) throw new BadRequestException('action is invalid');
    if (typeof body?.reasonCategory !== 'string' || !body.reasonCategory.trim()) throw new BadRequestException('reasonCategory is required');
    const expiresAt = body.expiresAt === undefined ? undefined : new Date(String(body.expiresAt));
    if (expiresAt && Number.isNaN(expiresAt.getTime())) throw new BadRequestException('expiresAt is invalid');
    return this.moderation.applyAction({ actorId: principal.accountId, caseId, targetId: body.targetId, action: body.action as ModerationActionType, reasonCategory: body.reasonCategory, ...(expiresAt ? { expiresAt } : {}), ...(correlationId ? { correlationId } : {}) });
  }
}

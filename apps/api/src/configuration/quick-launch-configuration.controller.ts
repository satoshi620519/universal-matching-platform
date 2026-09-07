import { BadRequestException, Body, Controller, Get, Headers, Inject, Param, Post } from '@nestjs/common';
import type { QuickLaunchDraft } from '@universal/domain';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';
import { QuickLaunchConfigurationService } from './quick-launch-configuration.service.js';
import { AuditRecordService } from '../administration/audit-record.service.js';

function parseDraft(value: unknown): QuickLaunchDraft {
  if (!value || typeof value !== 'object') throw new BadRequestException('draft is required');
  return value as QuickLaunchDraft;
}

@Controller('administration/quick-launch')
export class QuickLaunchConfigurationController {
  constructor(
    @Inject(RequestPrincipalResolver) private readonly principals: RequestPrincipalResolver,
    @Inject(AdministrativeCapabilityAccessService) private readonly access: AdministrativeCapabilityAccessService,
    @Inject(QuickLaunchConfigurationService) private readonly quickLaunch: QuickLaunchConfigurationService,
    @Inject(AuditRecordService) private readonly audit: AuditRecordService,
  ) {}

  private async administrator(authorization?: string, correlationId?: string) {
    const principal = await this.principals.requireAuthenticated({
      authorization,
      requestId: correlationId?.trim() || 'quick-launch',
    });
    await this.access.require(principal.accountId, 'manage-quick-launch');
    return principal;
  }

  @Post('drafts')
  async create(@Body() body: unknown, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.administrator(authorization, correlationId);
    const result = await this.quickLaunch.createDraft(parseDraft(body));
    await this.audit.append({ actorId: principal.accountId, area: 'security', action: 'create-quick-launch-draft', targetId: String(result.version), ...(correlationId?.trim() ? { correlationId: correlationId.trim() } : {}), occurredAt: new Date().toISOString() });
    return result;
  }

  @Post('drafts/:version')
  async save(@Param('version') version: string, @Body() body: unknown, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.administrator(authorization, correlationId);
    const parsed = Number(version);
    if (!Number.isSafeInteger(parsed) || parsed < 1) throw new BadRequestException('version is invalid');
    const result = await this.quickLaunch.saveDraft(parsed, parseDraft(body));
    await this.audit.append({ actorId: principal.accountId, area: 'security', action: 'save-quick-launch-draft', targetId: String(parsed), ...(correlationId?.trim() ? { correlationId: correlationId.trim() } : {}), occurredAt: new Date().toISOString() });
    return result;
  }

  @Post('drafts/:version/publish')
  async publish(@Param('version') version: string, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    const principal = await this.administrator(authorization, correlationId);
    const parsed = Number(version);
    if (!Number.isSafeInteger(parsed) || parsed < 1) throw new BadRequestException('version is invalid');
    const result = await this.quickLaunch.publish(parsed);
    await this.audit.append({ actorId: principal.accountId, area: 'security', action: 'publish-quick-launch-configuration', targetId: String(parsed), ...(correlationId?.trim() ? { correlationId: correlationId.trim() } : {}), occurredAt: new Date().toISOString() });
    return result;
  }

  @Get('published')
  async published(@Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    await this.administrator(authorization, correlationId);
    return this.quickLaunch.findPublished();
  }

  @Get('history')
  async history(@Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationId?: string) {
    await this.administrator(authorization, correlationId);
    return this.quickLaunch.listHistory();
  }
}

import { Injectable } from '@nestjs/common';
import { AuditRecordService } from '../administration/audit-record.service.js';
import { ConfigurationPublicationService, type ConfigurationPublicationAuditContext } from './configuration-publication.service.js';
import { ConfigurationVersionRepository } from './configuration-version.repository.js';
import type { ConfigurationScope } from '@universal/domain';

@Injectable()
export class ConfigurationReversionService {
  constructor(
    private readonly versions: ConfigurationVersionRepository,
    private readonly publication: ConfigurationPublicationService,
    private readonly audit: AuditRecordService,
  ) {}

  async revert(
    scope: ConfigurationScope,
    versionNumber: bigint,
    auditContext: ConfigurationPublicationAuditContext,
  ) {
    const historical = await this.versions.findByVersionNumber(scope, versionNumber);
    if (!historical || historical.status === 'draft') {
      throw new Error('configuration historical version not found');
    }

    const nextVersion = await this.versions.nextVersionNumber(scope);
    const draft = await this.versions.createDraftFromVersion(historical.id, nextVersion);

    const published = await this.publication.publish(draft.id, auditContext);

    await this.audit.append({
      actorId: auditContext.actorId,
      area: 'configuration',
      action: 'revert-configuration-version',
      targetId: published.id,
      ...(auditContext.correlationId ? { correlationId: auditContext.correlationId } : {}),
      occurredAt: new Date().toISOString(),
    });

    return published;
  }
}

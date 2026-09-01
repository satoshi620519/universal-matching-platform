import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { AuditRecordService } from '../administration/audit-record.service.js';
import { ConfigurationVersionRepository, type ConfigurationVersionRecord } from './configuration-version.repository.js';

export interface ConfigurationPublicationAuditContext {
  readonly actorId: string;
  readonly correlationId?: string;
}

@Injectable()
export class ConfigurationPublicationService {
  constructor(
    private readonly database: DatabaseService,
    private readonly versions: ConfigurationVersionRepository,
    private readonly audit: AuditRecordService,
  ) {}

  async publish(
    draftId: string,
    auditContext: ConfigurationPublicationAuditContext,
    publishedAt = new Date(),
  ): Promise<ConfigurationVersionRecord> {
    const draft = await this.versions.findDraft(draftId);
    if (!draft) throw new Error('configuration draft not found');

    await this.database.$transaction(async (tx) => {
      await tx.configurationVersion.updateMany({
        where: { scope: draft.scope, status: 'published' },
        data: { status: 'superseded', supersededAt: publishedAt },
      });
      const published = await tx.configurationVersion.updateMany({
        where: { id: draft.id, status: 'draft' },
        data: { status: 'published', publishedAt },
      });
      if (published.count !== 1) throw new Error('configuration draft is no longer publishable');
    });

    await this.audit.append({
      actorId: auditContext.actorId,
      area: 'configuration',
      action: 'publish-configuration-version',
      targetId: draft.id,
      ...(auditContext.correlationId ? { correlationId: auditContext.correlationId } : {}),
      occurredAt: publishedAt.toISOString(),
    });

    return { ...draft, status: 'published', publishedAt };
  }
}

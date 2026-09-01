import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { ConfigurationVersionRepository, type ConfigurationVersionRecord } from './configuration-version.repository.js';

@Injectable()
export class ConfigurationPublicationService {
  constructor(
    private readonly database: DatabaseService,
    private readonly versions: ConfigurationVersionRepository,
  ) {}

  async publish(draftId: string, publishedAt = new Date()): Promise<ConfigurationVersionRecord> {
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

    return {
      ...draft,
      status: 'published',
      publishedAt,
    };
  }
}

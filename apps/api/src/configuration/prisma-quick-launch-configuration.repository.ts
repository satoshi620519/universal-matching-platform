import { Injectable } from '@nestjs/common';
import type { QuickLaunchDraft, PublishedQuickLaunchConfiguration } from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';
import {
  QuickLaunchConfigurationRepository,
  type QuickLaunchConfigurationRecord,
} from './quick-launch-configuration.repository.js';

/**
 * Persists purchaser Quick Launch state as immutable JSON snapshots.
 * A published snapshot is never updated; publication supersedes the previous row.
 */
@Injectable()
export class PrismaQuickLaunchConfigurationRepository extends QuickLaunchConfigurationRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async createDraft(draft: QuickLaunchDraft): Promise<QuickLaunchConfigurationRecord> {
    return this.map(await this.database.quickLaunchConfiguration.create({
      data: { status: 'draft', draft: JSON.parse(JSON.stringify(draft)) },
    }));
  }

  async saveDraft(version: number, draft: QuickLaunchDraft): Promise<QuickLaunchConfigurationRecord> {
    return this.map(await this.database.quickLaunchConfiguration.update({
      where: { version }, data: { draft: JSON.parse(JSON.stringify(draft)) },
    }));
  }

  async findDraft(version: number): Promise<QuickLaunchConfigurationRecord | undefined> {
    const row = await this.database.quickLaunchConfiguration.findFirst({ where: { version, status: 'draft' } });
    return row ? this.map(row) : undefined;
  }

  async findPublished(): Promise<QuickLaunchConfigurationRecord | undefined> {
    const row = await this.database.quickLaunchConfiguration.findFirst({ where: { status: 'published' }, orderBy: { version: 'desc' } });
    return row ? this.map(row) : undefined;
  }

  async publish(version: number, published: PublishedQuickLaunchConfiguration): Promise<QuickLaunchConfigurationRecord> {
    return this.database.$transaction(async (tx) => {
      await tx.quickLaunchConfiguration.updateMany({ where: { status: 'published' }, data: { status: 'superseded' } });
      const row = await tx.quickLaunchConfiguration.update({
        where: { version },
        data: { status: 'published', published: JSON.parse(JSON.stringify(published)) },
      });
      return this.map(row);
    });
  }

  async listHistory(): Promise<readonly QuickLaunchConfigurationRecord[]> {
    const rows = await this.database.quickLaunchConfiguration.findMany({ orderBy: { version: 'asc' } });
    return rows.map((row) => this.map(row));
  }

  private map(row: any): QuickLaunchConfigurationRecord {
    return {
      version: row.version,
      status: row.status,
      draft: row.draft as QuickLaunchDraft,
      ...(row.published ? { published: row.published as PublishedQuickLaunchConfiguration } : {}),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

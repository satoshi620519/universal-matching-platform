import { Injectable } from '@nestjs/common';
import type { ConfigurationScope } from '@universal/domain';

import { DatabaseService } from '../database/database.service.js';
import {
  ConfigurationVersionRepository,
  type ConfigurationVersionRecord,
} from './configuration-version.repository.js';

@Injectable()
export class PrismaConfigurationVersionRepository extends ConfigurationVersionRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async createDraft(scope: ConfigurationScope, versionNumber: bigint): Promise<ConfigurationVersionRecord> {
    return this.map(await this.database.configurationVersion.create({
      data: { scope, status: 'draft', versionNumber },
    }));
  }

  async findDraft(id: string): Promise<ConfigurationVersionRecord | undefined> {
    const row = await this.database.configurationVersion.findFirst({
      where: { id, status: 'draft' },
    });
    return row ? this.map(row) : undefined;
  }

  async findPublished(scope: ConfigurationScope): Promise<ConfigurationVersionRecord | undefined> {
    const row = await this.database.configurationVersion.findFirst({
      where: { scope, status: 'published' },
      orderBy: { publishedAt: 'desc' },
    });
    return row ? this.map(row) : undefined;
  }

  private map(row: {
    id: string; scope: string; status: string; versionNumber: bigint;
    createdAt: Date; publishedAt: Date | null; supersededAt: Date | null;
  }): ConfigurationVersionRecord {
    return {
      id: row.id,
      scope: row.scope as ConfigurationScope,
      status: row.status as ConfigurationVersionRecord['status'],
      versionNumber: row.versionNumber,
      createdAt: row.createdAt,
      ...(row.publishedAt ? { publishedAt: row.publishedAt } : {}),
      ...(row.supersededAt ? { supersededAt: row.supersededAt } : {}),
    };
  }
}

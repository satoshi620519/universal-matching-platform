import type { ConfigurationScope } from '@universal/domain';

export type ConfigurationVersionStatus = 'draft' | 'published' | 'superseded';

export interface ConfigurationVersionRecord {
  readonly id: string;
  readonly scope: ConfigurationScope;
  readonly status: ConfigurationVersionStatus;
  readonly versionNumber: bigint;
  readonly createdAt: Date;
  readonly publishedAt?: Date;
  readonly supersededAt?: Date;
}

export abstract class ConfigurationVersionRepository {
  abstract createDraft(scope: ConfigurationScope, versionNumber: bigint): Promise<ConfigurationVersionRecord>;
  abstract findDraft(id: string): Promise<ConfigurationVersionRecord | undefined>;
  abstract findPublished(scope: ConfigurationScope): Promise<ConfigurationVersionRecord | undefined>;
  abstract findByVersionNumber(scope: ConfigurationScope, versionNumber: bigint): Promise<ConfigurationVersionRecord | undefined>;
  abstract nextVersionNumber(scope: ConfigurationScope): Promise<bigint>;
  abstract createDraftFromVersion(sourceVersionId: string, versionNumber: bigint): Promise<ConfigurationVersionRecord>;
}

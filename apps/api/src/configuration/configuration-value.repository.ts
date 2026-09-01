import type { ConfigurationPrimitiveType } from '@universal/domain';

export interface DraftConfigurationValueRecord {
  readonly versionId: string;
  readonly settingKey: string;
  readonly valueType: ConfigurationPrimitiveType;
  readonly value: boolean | bigint | number | string;
}

export abstract class ConfigurationValueRepository {
  abstract upsertDraftValue(value: DraftConfigurationValueRecord): Promise<void>;
}

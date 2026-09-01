import type { ConfigurationScope } from '@universal/domain';

export interface PublishedConfigurationValueRecord {
  readonly scope: ConfigurationScope;
  readonly settingKey: string;
  readonly value: boolean | bigint | number | string;
}

export abstract class ConfigurationEffectiveValueRepository {
  abstract findPublishedValues(settingKey: string): Promise<readonly PublishedConfigurationValueRecord[]>;
}

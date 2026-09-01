import type { ConfigurationSettingDefinition<unknown> } from '@universal/domain';

export abstract class ConfigurationSettingDefinition<unknown>Provider {
  abstract find(key: string): ConfigurationSettingDefinition<unknown> | undefined;
}

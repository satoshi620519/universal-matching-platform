import type { ConfigurationSettingDefinition } from '@universal/domain';

export abstract class ConfigurationSettingDefinitionProvider {
  abstract find(key: string): ConfigurationSettingDefinition<unknown> | undefined;
}

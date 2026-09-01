import type { DraftConfigurationSettingDefinition } from '@universal/domain';

export abstract class ConfigurationSettingDefinitionProvider {
  abstract find(key: string): DraftConfigurationSettingDefinition | undefined;
}

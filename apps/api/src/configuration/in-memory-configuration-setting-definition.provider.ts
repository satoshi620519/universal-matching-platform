import { Injectable } from '@nestjs/common';
import type { DraftConfigurationSettingDefinition } from '@universal/domain';
import { ConfigurationSettingDefinitionProvider } from './configuration-setting-definition.provider.js';

const DEFAULT_DEFINITIONS: readonly DraftConfigurationSettingDefinition[] = [
  { key: 'localization.configuration', valueType: 'text', allowedScopes: ['deployment'] },
  { key: 'location.precision', valueType: 'text', allowedScopes: ['deployment'] },
  { key: 'distance.presentation', valueType: 'text', allowedScopes: ['deployment'] },
];

@Injectable()
export class InMemoryConfigurationSettingDefinitionProvider extends ConfigurationSettingDefinitionProvider {
  constructor(private readonly definitions: readonly DraftConfigurationSettingDefinition[] = DEFAULT_DEFINITIONS) {
    super();
  }

  find(key: string): DraftConfigurationSettingDefinition | undefined {
    return this.definitions.find((definition) => definition.key === key);
  }
}

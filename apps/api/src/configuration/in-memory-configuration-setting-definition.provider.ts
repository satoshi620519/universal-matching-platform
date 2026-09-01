import { Injectable } from '@nestjs/common';
import type { DraftConfigurationSettingDefinition } from '@universal/domain';
import { ConfigurationSettingDefinitionProvider } from './configuration-setting-definition.provider.js';

@Injectable()
export class InMemoryConfigurationSettingDefinitionProvider extends ConfigurationSettingDefinitionProvider {
  constructor(private readonly definitions: readonly DraftConfigurationSettingDefinition[] = []) {
    super();
  }

  find(key: string): DraftConfigurationSettingDefinition | undefined {
    return this.definitions.find((definition) => definition.key === key);
  }
}

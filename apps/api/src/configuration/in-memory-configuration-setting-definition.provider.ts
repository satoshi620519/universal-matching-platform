import { Injectable } from '@nestjs/common';
import type { ConfigurationSettingDefinition } from '@universal/domain';
import { ConfigurationSettingDefinitionProvider } from './configuration-setting-definition.provider.js';

@Injectable()
export class InMemoryConfigurationSettingDefinitionProvider extends ConfigurationSettingDefinitionProvider {
  constructor(private readonly definitions: readonly ConfigurationSettingDefinition<unknown>[] = []) { super(); }

  find(key: string): ConfigurationSettingDefinition<unknown> | undefined {
    return this.definitions.find((definition) => definition.key === key);
  }
}

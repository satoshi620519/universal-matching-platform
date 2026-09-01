import { Injectable } from '@nestjs/common';
import type { ConfigurationSettingDefinition<unknown> } from '@universal/domain';
import { ConfigurationSettingDefinition<unknown>Provider } from './configuration-setting-definition.provider.js';

@Injectable()
export class InMemoryConfigurationSettingDefinition<unknown>Provider extends ConfigurationSettingDefinition<unknown>Provider {
  constructor(private readonly definitions: readonly ConfigurationSettingDefinition<unknown>[] = []) { super(); }

  find(key: string): ConfigurationSettingDefinition<unknown> | undefined {
    return this.definitions.find((definition) => definition.key === key);
  }
}

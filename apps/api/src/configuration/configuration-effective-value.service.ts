import { Injectable } from '@nestjs/common';
import {
  resolveConfigurationValue,
  type ConfigurationSettingDefinition,
} from '@universal/domain';
import { ConfigurationEffectiveValueRepository } from './configuration-effective-value.repository.js';

@Injectable()
export class ConfigurationEffectiveValueService {
  constructor(private readonly values: ConfigurationEffectiveValueRepository) {}

  async resolve(
    definition: ConfigurationSettingDefinition,
  ): Promise<boolean | bigint | number | string> {
    const published = await this.values.findPublishedValues(definition.key);
    return resolveConfigurationValue(
      definition,
      published.map((value) => ({
        scope: value.scope,
        value: value.value as boolean | bigint | number | string,
      })),
    );
  }
}

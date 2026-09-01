import { Injectable } from '@nestjs/common';
import {
  resolveConfigurationValue,
  type ConfigurationSettingDefinition as ResolutionConfigurationSettingDefinition,
} from '@universal/domain';
import { ConfigurationEffectiveValueRepository } from './configuration-effective-value.repository.js';

@Injectable()
export class ConfigurationEffectiveValueService {
  constructor(private readonly values: ConfigurationEffectiveValueRepository) {}

  async resolve<T>(
    definition: ResolutionConfigurationSettingDefinition<T>,
  ): Promise<T> {
    const published = await this.values.findPublishedValues(definition.key);
    return resolveConfigurationValue(
      definition,
      published.map((value) => ({
        scope: value.scope,
        value: value.value as T,
      })),
    );
  }
}

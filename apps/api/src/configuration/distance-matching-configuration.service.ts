import { Injectable } from '@nestjs/common';
import { ConfigurationEffectiveValueService } from './configuration-effective-value.service.js';

const SETTING_KEY = 'distance.matching.enabled';

@Injectable()
export class DistanceMatchingConfigurationService {
  constructor(private readonly values: ConfigurationEffectiveValueService) {}

  async isEnabled(): Promise<boolean> {
    const value = await this.values.resolve<boolean>({
      key: SETTING_KEY,
      defaultValue: false,
      allowedScopes: ['deployment'],
    });
    if (typeof value !== 'boolean') {
      throw new Error('distance matching enabled configuration must be boolean');
    }
    return value;
  }
}

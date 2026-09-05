import { Injectable } from '@nestjs/common';
import {
  defaultLocationPrecisionPolicy,
  validateLocationPrecisionPolicy,
  type LocationPrecisionPolicy,
} from '@universal/domain';
import { ConfigurationEffectiveValueService } from './configuration-effective-value.service.js';

const SETTING_KEY = 'location.precision';

@Injectable()
export class LocationPrecisionConfigurationService {
  constructor(private readonly values: ConfigurationEffectiveValueService) {}

  async resolve(): Promise<LocationPrecisionPolicy> {
    const serialized = await this.values.resolve<string>({
      key: SETTING_KEY,
      defaultValue: JSON.stringify(defaultLocationPrecisionPolicy),
      allowedScopes: ['deployment'],
    });

    let policy: unknown;
    try {
      policy = JSON.parse(serialized);
    } catch {
      throw new Error('location precision configuration must be valid JSON');
    }

    if (!isLocationPrecisionPolicy(policy)) {
      throw new Error('location precision configuration has an invalid shape');
    }

    validateLocationPrecisionPolicy(policy);
    return policy;
  }
}

function isLocationPrecisionPolicy(value: unknown): value is LocationPrecisionPolicy {
  return typeof value === 'object'
    && value !== null
    && typeof (value as Record<string, unknown>).publicPrecision === 'string';
}

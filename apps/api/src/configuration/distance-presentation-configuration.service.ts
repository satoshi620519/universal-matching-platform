import { Injectable } from '@nestjs/common';
import {
  defaultDistancePresentationPolicy,
  validateDistancePresentationPolicy,
  type DistancePresentationPolicy,
} from '@universal/domain';
import { ConfigurationEffectiveValueService } from './configuration-effective-value.service.js';

const SETTING_KEY = 'distance.presentation';

@Injectable()
export class DistancePresentationConfigurationService {
  constructor(private readonly values: ConfigurationEffectiveValueService) {}

  async resolve(): Promise<DistancePresentationPolicy> {
    const serialized = await this.values.resolve<string>({
      key: SETTING_KEY,
      defaultValue: JSON.stringify(defaultDistancePresentationPolicy),
      allowedScopes: ['deployment'],
    });
    let policy: unknown;
    try {
      policy = JSON.parse(serialized);
    } catch {
      throw new Error('distance presentation configuration must be valid JSON');
    }
    if (!isDistancePresentationPolicy(policy)) {
      throw new Error('distance presentation configuration has an invalid shape');
    }
    validateDistancePresentationPolicy(policy);
    return policy;
  }
}

function isDistancePresentationPolicy(value: unknown): value is DistancePresentationPolicy {
  return typeof value === 'object'
    && value !== null
    && typeof (value as Record<string, unknown>).unit === 'string';
}

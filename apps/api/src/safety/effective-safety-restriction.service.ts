import { Injectable } from '@nestjs/common';
import {
  resolveEffectiveSafetyRestriction,
  type CapabilityScope,
  type SafetyRestriction,
} from '@universal/domain';

import { SafetyEnforcementRepository } from './safety-enforcement.repository.js';

@Injectable()
export class EffectiveSafetyRestrictionService {
  constructor(
    private readonly enforcements: SafetyEnforcementRepository,
  ) {}

  async resolveForAccount(
    accountId: string,
    scope: CapabilityScope,
    now = new Date(),
  ): Promise<SafetyRestriction> {
    const active = await this.enforcements.findActiveForAccount(accountId, now);
    return resolveEffectiveSafetyRestriction(active, scope);
  }
}

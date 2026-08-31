import { Injectable } from '@nestjs/common';
import {
  decideCapability,
  type CapabilityDecision,
  type CapabilityDecisionContext,
  type EntitlementState,
  type VerificationLevel,
} from '@universal/domain';

import type { RequestPrincipal } from '../auth/request-principal.js';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
import { EffectiveSafetyRestrictionService } from '../safety/effective-safety-restriction.service.js';

export interface AuthenticatedCapabilityDecisionRequirements {
  readonly capabilityScope: 'general' | 'communication';
  readonly requiredVerificationLevel?: VerificationLevel;
  readonly entitlementState?: EntitlementState;
  readonly entitlementEffectiveAt?: string;
  readonly now?: string;
}

@Injectable()
export class AuthenticatedCapabilityDecisionService {
  constructor(
    private readonly accounts: AuthenticatedAccountContextService,
    private readonly safetyRestrictions: EffectiveSafetyRestrictionService,
  ) {}

  async evaluate(
    principal: RequestPrincipal,
    requirements: AuthenticatedCapabilityDecisionRequirements,
  ): Promise<CapabilityDecision> {
    const { account } = await this.accounts.resolve(principal);
    const currentVerificationLevel = this.resolveVerificationLevel(principal);
    const now = requirements.now ?? new Date().toISOString();
    const safetyRestriction = await this.safetyRestrictions.resolveForAccount(
      account.id,
      requirements.capabilityScope,
      new Date(now),
    );

    const context: CapabilityDecisionContext = {
      accountState: account.status,
      currentVerificationLevel,
      safetyRestriction,
      ...requirements,
    };

    return decideCapability(context);
  }

  private resolveVerificationLevel(
    principal: RequestPrincipal,
  ): VerificationLevel {
    if (principal.verificationLevel === undefined) {
      return 0;
    }

    const value = Number(principal.verificationLevel);
    if (!Number.isInteger(value) || value < 0 || value > 3) {
      return 0;
    }

    return value as VerificationLevel;
  }
}

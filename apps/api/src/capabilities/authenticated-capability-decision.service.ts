import { Injectable } from '@nestjs/common';
import {
  decideCapability,
  type CapabilityDecision,
  type CapabilityDecisionContext,
  type EntitlementState,
  type SafetyRestriction,
  type VerificationLevel,
} from '@universal/domain';

import type { RequestPrincipal } from '../auth/request-principal.js';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';

export interface AuthenticatedCapabilityDecisionRequirements {
  readonly capabilityScope: 'general' | 'communication';
  readonly safetyRestriction: SafetyRestriction;
  readonly requiredVerificationLevel?: VerificationLevel;
  readonly entitlementState?: EntitlementState;
  readonly entitlementEffectiveAt?: string;
  readonly now?: string;
}

@Injectable()
export class AuthenticatedCapabilityDecisionService {
  constructor(
    private readonly accounts: AuthenticatedAccountContextService,
  ) {}

  async evaluate(
    principal: RequestPrincipal,
    requirements: AuthenticatedCapabilityDecisionRequirements,
  ): Promise<CapabilityDecision> {
    const { account } = await this.accounts.resolve(principal);
    const currentVerificationLevel = this.resolveVerificationLevel(principal);

    const context: CapabilityDecisionContext = {
      accountState: account.status,
      currentVerificationLevel,
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

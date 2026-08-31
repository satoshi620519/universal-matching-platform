import { Injectable } from '@nestjs/common';
import type { EntitlementState, VerificationLevel } from '@universal/domain';
import type { RequestPrincipal } from '../auth/request-principal.js';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
import { VerificationService } from '../verification/verification.service.js';
import {
  CapabilityAccessService,
  type CapabilityAccessResult,
} from './capability-access.service.js';

export interface AuthenticatedCapabilityRequirements {
  readonly requiredVerificationLevel?: VerificationLevel;
  readonly entitlementState?: EntitlementState;
  readonly entitlementEffectiveAt?: string;
  readonly now?: string;
}

@Injectable()
export class AuthenticatedCapabilityAccessService {
  constructor(
    private readonly context: AuthenticatedAccountContextService,
    private readonly verification: VerificationService,
    private readonly capabilities: CapabilityAccessService,
  ) {}

  async evaluate(
    principal: RequestPrincipal,
    requirements: AuthenticatedCapabilityRequirements,
  ): Promise<CapabilityAccessResult> {
    const { account } = await this.context.resolve(principal);
    const now = requirements.now ?? new Date().toISOString();
    const usableRecord = await this.verification.findUsableRecordForAccount(
      account.id,
      now,
    );

    return this.capabilities.evaluate({
      ...requirements,
      now,
      currentVerificationLevel: (usableRecord?.level ?? 0) as VerificationLevel,
    });
  }
}

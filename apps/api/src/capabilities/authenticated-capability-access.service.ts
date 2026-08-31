import { Injectable, BadRequestException } from '@nestjs/common';
import type { EntitlementState, VerificationLevel } from '@universal/domain';
import type { RequestPrincipal } from '../auth/request-principal.js';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
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
    private readonly capabilities: CapabilityAccessService,
  ) {}

  async evaluate(
    principal: RequestPrincipal,
    requirements: AuthenticatedCapabilityRequirements,
  ): Promise<CapabilityAccessResult> {
    await this.context.resolve(principal);

    if (principal.verificationLevel === undefined) {
      throw new BadRequestException('authenticated principal verificationLevel is required');
    }

    const value = Number(principal.verificationLevel);
    if (!Number.isInteger(value) || value < 0 || value > 3) {
      throw new BadRequestException('principal.verificationLevel must be an integer from 0 to 3');
    }

    return this.capabilities.evaluate({
      currentVerificationLevel: value as VerificationLevel,
      ...requirements,
    });
  }
}

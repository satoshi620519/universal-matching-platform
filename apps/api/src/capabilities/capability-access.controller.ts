import { Controller, Get, Query } from '@nestjs/common';
import type {
  CapabilityContext,
  EntitlementState,
  VerificationLevel,
} from '@universal/domain';
import { CapabilityAccessService } from './capability-access.service.js';

interface CapabilityAccessQuery {
  readonly currentVerificationLevel: string;
  readonly requiredVerificationLevel?: string;
  readonly entitlementState?: EntitlementState;
  readonly entitlementEffectiveAt?: string;
  readonly now?: string;
}

@Controller('capabilities')
export class CapabilityAccessController {
  constructor(private readonly capabilityAccess: CapabilityAccessService) {}

  @Get('access')
  evaluate(@Query() query: CapabilityAccessQuery) {
    const context: CapabilityContext = {
      currentVerificationLevel: Number(
        query.currentVerificationLevel,
      ) as VerificationLevel,
      ...(query.requiredVerificationLevel !== undefined
        ? {
            requiredVerificationLevel: Number(
              query.requiredVerificationLevel,
            ) as VerificationLevel,
          }
        : {}),
      ...(query.entitlementState
        ? { entitlementState: query.entitlementState }
        : {}),
      ...(query.entitlementEffectiveAt
        ? { entitlementEffectiveAt: query.entitlementEffectiveAt }
        : {}),
      ...(query.now ? { now: query.now } : {}),
    };

    return this.capabilityAccess.evaluate(context);
  }
}

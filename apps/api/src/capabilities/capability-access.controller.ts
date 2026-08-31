import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import type { CapabilityContext, EntitlementState, VerificationLevel } from '@universal/domain';
import { CapabilityAccessService } from './capability-access.service.js';

interface CapabilityAccessQuery {
  readonly currentVerificationLevel: string;
  readonly requiredVerificationLevel?: string;
  readonly entitlementState?: string;
  readonly entitlementEffectiveAt?: string;
  readonly now?: string;
}

const verificationLevels = new Set(['0', '1', '2', '3']);
const entitlementStates = new Set<EntitlementState>([
  'pending', 'active', 'scheduled-expiration', 'expired', 'revoked', 'suspended',
]);

function parseVerificationLevel(value: string, field: string): VerificationLevel {
  if (!verificationLevels.has(value)) throw new BadRequestException(`${field} must be an integer from 0 to 3`);
  return Number(value) as VerificationLevel;
}

function validateDate(value: string | undefined, field: string): void {
  if (value !== undefined && Number.isNaN(new Date(value).getTime())) {
    throw new BadRequestException(`${field} must be a valid ISO date`);
  }
}

@Controller('capabilities')
export class CapabilityAccessController {
  constructor(private readonly capabilityAccess: CapabilityAccessService) {}

  @Get('access')
  evaluate(@Query() query: CapabilityAccessQuery) {
    if (query.entitlementState && !entitlementStates.has(query.entitlementState as EntitlementState)) {
      throw new BadRequestException('entitlementState is invalid');
    }

    validateDate(query.entitlementEffectiveAt, 'entitlementEffectiveAt');
    validateDate(query.now, 'now');

    const context: CapabilityContext = {
      currentVerificationLevel: parseVerificationLevel(query.currentVerificationLevel, 'currentVerificationLevel'),
      ...(query.requiredVerificationLevel !== undefined
        ? { requiredVerificationLevel: parseVerificationLevel(query.requiredVerificationLevel, 'requiredVerificationLevel') }
        : {}),
      ...(query.entitlementState ? { entitlementState: query.entitlementState as EntitlementState } : {}),
      ...(query.entitlementEffectiveAt ? { entitlementEffectiveAt: query.entitlementEffectiveAt } : {}),
      ...(query.now ? { now: query.now } : {}),
    };

    return this.capabilityAccess.evaluate(context);
  }
}

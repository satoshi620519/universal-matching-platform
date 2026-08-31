import { BadRequestException, Controller, Get, Headers, Query } from '@nestjs/common';
import type { CapabilityContext, EntitlementState, VerificationLevel } from '@universal/domain';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { CapabilityAccessService } from './capability-access.service.js';
import { AuthenticatedCapabilityAccessService } from './authenticated-capability-access.service.js';

interface CapabilityAccessQuery {
  readonly currentVerificationLevel: string;
  readonly requiredVerificationLevel?: string;
  readonly entitlementState?: string;
  readonly entitlementEffectiveAt?: string;
  readonly now?: string;
}

interface AuthenticatedCapabilityAccessQuery {
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

function buildContext(
  query: Omit<CapabilityAccessQuery, 'currentVerificationLevel'>,
  currentVerificationLevel: VerificationLevel,
): CapabilityContext {
  if (query.entitlementState && !entitlementStates.has(query.entitlementState as EntitlementState)) {
    throw new BadRequestException('entitlementState is invalid');
  }

  validateDate(query.entitlementEffectiveAt, 'entitlementEffectiveAt');
  validateDate(query.now, 'now');

  return {
    currentVerificationLevel,
    ...(query.requiredVerificationLevel !== undefined
      ? { requiredVerificationLevel: parseVerificationLevel(query.requiredVerificationLevel, 'requiredVerificationLevel') }
      : {}),
    ...(query.entitlementState ? { entitlementState: query.entitlementState as EntitlementState } : {}),
    ...(query.entitlementEffectiveAt ? { entitlementEffectiveAt: query.entitlementEffectiveAt } : {}),
    ...(query.now ? { now: query.now } : {}),
  };
}

@Controller('capabilities')
export class CapabilityAccessController {
  constructor(
    private readonly capabilityAccess: CapabilityAccessService,
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly authenticatedCapabilityAccess: AuthenticatedCapabilityAccessService,
  ) {}

  @Get('access')
  evaluate(@Query() query: CapabilityAccessQuery) {
    return this.capabilityAccess.evaluate(
      buildContext(query, parseVerificationLevel(query.currentVerificationLevel, 'currentVerificationLevel')),
    );
  }

  @Get('access/authenticated')
  async evaluateAuthenticated(
    @Query() query: AuthenticatedCapabilityAccessQuery,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'capability-access-authenticated',
    });

    return this.authenticatedCapabilityAccess.evaluate(principal, buildContext(query, 0));
  }
}

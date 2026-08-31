import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CapabilityAccessService } from '../capabilities/capability-access.service.js';
import {
  getRequestPrincipal,
  type AuthenticatedFastifyRequest,
} from './authenticated-request.js';

export interface CapabilityRequirement {
  readonly requiredVerificationLevel?: 0 | 1 | 2 | 3;
  readonly entitlementState?: 'pending' | 'active' | 'scheduled-expiration' | 'expired' | 'revoked' | 'suspended';
  readonly entitlementEffectiveAt?: string;
}

@Injectable()
export class CapabilityAuthorizationGuard implements CanActivate {
  constructor(
    private readonly capabilityAccess: CapabilityAccessService,
    private readonly requirement: CapabilityRequirement = {},
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedFastifyRequest>();

    const principal = getRequestPrincipal(request);
    const currentVerificationLevel = Number(
      principal?.verificationLevel ?? 0,
    ) as 0 | 1 | 2 | 3;

    const decision = this.capabilityAccess.evaluate({
      currentVerificationLevel,
      ...this.requirement,
    });

    if (!decision.allowed) {
      throw new ForbiddenException({
        message: 'Capability access denied',
        reason: decision.reason,
      });
    }

    return true;
  }
}

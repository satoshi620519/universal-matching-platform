import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { CapabilityAccessService } from '../capabilities/capability-access.service.js';

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
    const request = context.switchToHttp().getRequest<
      FastifyRequest & {
        principal?: { verificationLevel?: string };
      }
    >();

    const currentVerificationLevel = Number(
      request.principal?.verificationLevel ?? 0,
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

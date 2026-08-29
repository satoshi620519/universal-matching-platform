import { Injectable } from '@nestjs/common';
import { canUseCapability, CapabilityContext } from '@universal/domain/capability.js';

export type CapabilityAccessReason = 'allowed' | 'verification-required' | 'entitlement-required' | 'not-yet-effective';

export interface CapabilityAccessResult {
  readonly allowed: boolean;
  readonly reason: CapabilityAccessReason;
}

@Injectable()
export class CapabilityAccessService {
  evaluate(context: CapabilityContext): CapabilityAccessResult {
    if (!canUseCapability(context)) {
      if (
        context.requiredVerificationLevel !== undefined &&
        context.currentVerificationLevel < context.requiredVerificationLevel
      ) {
        return { allowed: false, reason: 'verification-required' };
      }

      if (
        context.entitlementState !== undefined &&
        context.entitlementState !== 'active' &&
        context.entitlementState !== 'scheduled-expiration'
      ) {
        return { allowed: false, reason: 'entitlement-required' };
      }

      if (context.entitlementEffectiveAt !== undefined) {
        const now = new Date(context.now ?? new Date().toISOString()).getTime();
        const effectiveAt = new Date(context.entitlementEffectiveAt).getTime();
        if (!Number.isNaN(effectiveAt) && now < effectiveAt) {
          return { allowed: false, reason: 'not-yet-effective' };
        }
      }
    }

    return { allowed: true, reason: 'allowed' };
  }
}

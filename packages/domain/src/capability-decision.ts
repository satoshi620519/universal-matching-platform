import type { AccountState } from './account.js';
import {
  canUseCapability,
  type EntitlementState,
  type VerificationLevel,
} from './capability.js';
import { blocksCapability, type SafetyRestriction } from './safety-restriction.js';

export type CapabilityDecisionReason =
  | 'allowed'
  | 'verification-insufficient'
  | 'entitlement-missing'
  | 'account-restricted'
  | 'safety-restricted';

export interface CapabilityDecision {
  readonly allowed: boolean;
  readonly reason: CapabilityDecisionReason;
}

export interface CapabilityDecisionContext {
  readonly accountState: AccountState;
  readonly safetyRestriction: SafetyRestriction;
  readonly capabilityScope: 'general' | 'communication';
  readonly currentVerificationLevel: VerificationLevel;
  readonly requiredVerificationLevel?: VerificationLevel;
  readonly entitlementState?: EntitlementState;
  readonly entitlementEffectiveAt?: string;
  readonly now?: string;
}

export function decideCapability(
  context: CapabilityDecisionContext,
): CapabilityDecision {
  if (blocksCapability(context.safetyRestriction, context.capabilityScope)) {
    return { allowed: false, reason: 'safety-restricted' };
  }

  if (context.accountState !== 'active') {
    return { allowed: false, reason: 'account-restricted' };
  }

  if (
    context.requiredVerificationLevel !== undefined &&
    context.currentVerificationLevel < context.requiredVerificationLevel
  ) {
    return { allowed: false, reason: 'verification-insufficient' };
  }

  if (!canUseCapability(context)) {
    return { allowed: false, reason: 'entitlement-missing' };
  }

  return { allowed: true, reason: 'allowed' };
}

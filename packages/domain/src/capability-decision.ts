import type { AccountState } from './account.js';
import type { EntitlementState, VerificationLevel } from './capability.js';
import type { SafetyRestriction } from './safety-restriction.js';

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

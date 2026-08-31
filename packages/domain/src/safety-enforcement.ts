import type { SafetyRestriction } from './safety-restriction.js';

export type SafetyEnforcementStatus = 'active' | 'revoked' | 'expired';

export interface SafetyEnforcement {
  readonly id: string;
  readonly accountId: string;
  readonly restriction: SafetyRestriction;
  readonly reasonCategory: string;
  readonly status: SafetyEnforcementStatus;
  readonly effectiveAt: string;
  readonly expiresAt?: string;
  readonly revokedAt?: string;
}

export function isSafetyEnforcementActive(
  enforcement: SafetyEnforcement,
  now: string,
): boolean {
  if (enforcement.status !== 'active') return false;
  if (enforcement.effectiveAt > now) return false;
  if (enforcement.expiresAt !== undefined && enforcement.expiresAt <= now) {
    return false;
  }
  return true;
}

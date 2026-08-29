export type VerificationLevel = 0 | 1 | 2 | 3;
export type EntitlementState = 'pending' | 'active' | 'scheduled-expiration' | 'expired' | 'revoked' | 'suspended';

export interface CapabilityContext {
  readonly requiredVerificationLevel?: VerificationLevel;
  readonly entitlementState?: EntitlementState;
  readonly entitlementEffectiveAt?: string;
  readonly now?: string;
}

export function canUseCapability(context: CapabilityContext): boolean {
  if (context.requiredVerificationLevel !== undefined && context.requiredVerificationLevel < 0) return false;
  if (context.entitlementState !== undefined && context.entitlementState !== 'active' && context.entitlementState !== 'scheduled-expiration') {
    return false;
  }

  if (context.entitlementEffectiveAt !== undefined) {
    const now = new Date(context.now ?? new Date().toISOString()).getTime();
    const effectiveAt = new Date(context.entitlementEffectiveAt).getTime();
    if (Number.isNaN(effectiveAt) || now < effectiveAt) return false;
  }

  return true;
}

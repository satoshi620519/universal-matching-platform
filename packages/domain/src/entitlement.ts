import type { EntitlementState } from './capability.js';

const transitions: Record<EntitlementState, readonly EntitlementState[]> = {
  pending: ['active', 'suspended', 'revoked'],
  active: ['scheduled-expiration', 'expired', 'revoked', 'suspended'],
  'scheduled-expiration': ['active', 'expired', 'revoked', 'suspended'],
  suspended: ['active', 'revoked', 'expired'],
  expired: [],
  revoked: [],
};

export function canTransitionEntitlementState(
  from: EntitlementState,
  to: EntitlementState,
): boolean {
  return transitions[from].includes(to);
}

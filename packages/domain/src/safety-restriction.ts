import type { AccountState } from './account.js';

export type SafetyRestriction =
  | 'none'
  | 'feature-restricted'
  | 'communication-restricted'
  | 'suspended';

export function blocksCapability(
  restriction: SafetyRestriction,
  capabilityScope: 'general' | 'communication',
): boolean {
  if (restriction === 'suspended') return true;
  if (restriction === 'feature-restricted') return true;
  return restriction === 'communication-restricted' && capabilityScope === 'communication';
}

export function effectiveAccountState(
  state: AccountState,
  restriction: SafetyRestriction,
): AccountState {
  return restriction === 'suspended' ? 'suspended' : state;
}

import type { SafetyEnforcement } from './safety-enforcement.js';
import type { SafetyRestriction } from './safety-restriction.js';

export type CapabilityScope = 'general' | 'communication';

const restrictionPriority: Record<SafetyRestriction, number> = {
  none: 0,
  'feature-restricted': 1,
  'communication-restricted': 2,
  suspended: 3,
  banned: 4,
};

export function resolveEffectiveSafetyRestriction(
  enforcements: readonly SafetyEnforcement[],
  scope: CapabilityScope,
): SafetyRestriction {
  const applicable = enforcements.filter((enforcement) =>
    appliesToScope(enforcement.restriction, scope),
  );

  return applicable.reduce<SafetyRestriction>((effective, enforcement) =>
    restrictionPriority[enforcement.restriction] >
    restrictionPriority[effective]
      ? enforcement.restriction
      : effective,
  'none');
}

function appliesToScope(
  restriction: SafetyRestriction,
  scope: CapabilityScope,
): boolean {
  if (restriction === 'none') return false;
  if (restriction === 'feature-restricted') return true;
  if (restriction === 'suspended') return true;
  return scope === 'communication';
}

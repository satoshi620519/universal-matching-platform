export type SafetyMetricKind =
  | 'reports-received'
  | 'actions-taken'
  | 'confirmed-policy-violations'
  | 'queue-age'
  | 'review-time'
  | 'appeal-outcomes';

export interface SafetyMetricDefinition {
  readonly kind: SafetyMetricKind;
  readonly version: number;
  readonly aggregationLevel: 'global' | 'region' | 'category';
  readonly includesIdentities: boolean;
}

export function isValidSafetyMetricDefinition(
  definition: SafetyMetricDefinition,
): boolean {
  return (
    Number.isInteger(definition.version) &&
    definition.version > 0 &&
    definition.includesIdentities === false
  );
}

export function areDistinctSafetyMetricKinds(
  kinds: readonly SafetyMetricKind[],
): boolean {
  return new Set(kinds).size === kinds.length;
}

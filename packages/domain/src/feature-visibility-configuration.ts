export interface FeatureVisibilityEntry {
  readonly key: string;
  readonly enabled: boolean;
}

export interface FeatureVisibilityConfiguration {
  readonly features: readonly FeatureVisibilityEntry[];
}

const keyPattern = /^[a-z][a-z0-9_]{1,63}$/;

export function validateFeatureVisibilityConfiguration(configuration: FeatureVisibilityConfiguration): void {
  const keys = new Set<string>();
  for (const feature of configuration.features) {
    if (!keyPattern.test(feature.key)) throw new Error('feature key must be stable snake_case');
    if (keys.has(feature.key)) throw new Error('feature keys must be unique');
    keys.add(feature.key);
  }
}

/**
 * Configuration-level visibility only. Runtime authorization must independently
 * enforce roles, safety restrictions and any future entitlement rules.
 */
export function isFeatureVisible(
  configuration: FeatureVisibilityConfiguration | undefined,
  key: string,
): boolean {
  if (!configuration) return true;
  const feature = configuration.features.find(candidate => candidate.key === key);
  return feature?.enabled ?? true;
}

export type ConfigurationScope =
  | 'platform'
  | 'deployment'
  | 'region'
  | 'category'
  | 'category-region';

export interface ConfigurationSettingDefinition<T> {
  readonly key: string;
  readonly defaultValue: T;
  readonly allowedScopes: readonly ConfigurationScope[];
}

export interface ConfigurationValue<T> {
  readonly scope: ConfigurationScope;
  readonly value: T;
}

const precedence: readonly ConfigurationScope[] = [
  'category-region',
  'category',
  'region',
  'deployment',
  'platform',
];

export function resolveConfigurationValue<T>(
  definition: ConfigurationSettingDefinition<T>,
  values: readonly ConfigurationValue<T>[],
): T {
  const allowed = values.filter((value) =>
    definition.allowedScopes.includes(value.scope),
  );

  for (const scope of precedence) {
    const value = allowed.find((candidate) => candidate.scope === scope);
    if (value !== undefined) return value.value;
  }

  return definition.defaultValue;
}

export function validateConfigurationValue<T>(
  definition: ConfigurationSettingDefinition<T>,
  value: ConfigurationValue<T>,
): void {
  if (!definition.key.trim()) {
    throw new Error('configuration key must not be empty');
  }
  if (!definition.allowedScopes.includes(value.scope)) {
    throw new Error(
      `configuration scope ${value.scope} is not allowed for ${definition.key}`,
    );
  }
}

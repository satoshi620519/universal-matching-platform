import type { ConfigurationScope } from './configuration-resolution.js';

export type ConfigurationPrimitiveType = 'boolean' | 'integer' | 'decimal' | 'text';

export interface ConfigurationSettingDefinition {
  readonly key: string;
  readonly valueType: ConfigurationPrimitiveType;
  readonly allowedScopes: readonly ConfigurationScope[];
}

export interface DraftConfigurationValue {
  readonly settingKey: string;
  readonly valueType: ConfigurationPrimitiveType;
  readonly scope: ConfigurationScope;
  readonly value: boolean | bigint | number | string;
}

export function validateDraftConfigurationValue(
  definition: ConfigurationSettingDefinition,
  input: DraftConfigurationValue,
): void {
  if (!definition.key.trim() || input.settingKey !== definition.key) {
    throw new Error('configuration setting definition does not match value');
  }
  if (definition.valueType !== input.valueType) {
    throw new Error('configuration value type does not match setting definition');
  }
  if (!definition.allowedScopes.includes(input.scope)) {
    throw new Error(`configuration scope ${input.scope} is not allowed for ${definition.key}`);
  }
  if (!matchesPrimitiveType(input.valueType, input.value)) {
    throw new Error('configuration value does not match declared primitive type');
  }
}

function matchesPrimitiveType(
  type: ConfigurationPrimitiveType,
  value: DraftConfigurationValue['value'],
): boolean {
  switch (type) {
    case 'boolean': return typeof value === 'boolean';
    case 'integer': return typeof value === 'bigint';
    case 'decimal': return typeof value === 'number' && Number.isFinite(value);
    case 'text': return typeof value === 'string';
  }
}

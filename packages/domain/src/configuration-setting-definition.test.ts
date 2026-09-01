import { describe, expect, it } from 'vitest';
import { validateDraftConfigurationValue } from './configuration-setting-definition.js';

const definition = { key: 'matching.max-distance', valueType: 'integer' as const, allowedScopes: ['deployment', 'region'] as const };

describe('draft configuration value validation', () => {
  it('accepts a matching typed value at an allowed scope', () => {
    expect(() => validateDraftConfigurationValue(definition, {
      settingKey: definition.key, valueType: 'integer', scope: 'region', value: 25n,
    })).not.toThrow();
  });

  it('rejects unknown/mismatched settings, types and scopes', () => {
    expect(() => validateDraftConfigurationValue(definition, {
      settingKey: 'other', valueType: 'integer', scope: 'region', value: 1n,
    })).toThrow('does not match value');
    expect(() => validateDraftConfigurationValue(definition, {
      settingKey: definition.key, valueType: 'text', scope: 'region', value: '1',
    })).toThrow('type');
    expect(() => validateDraftConfigurationValue(definition, {
      settingKey: definition.key, valueType: 'integer', scope: 'category', value: 1n,
    })).toThrow('not allowed');
  });

  it('rejects values incompatible with the declared primitive type', () => {
    expect(() => validateDraftConfigurationValue(definition, {
      settingKey: definition.key, valueType: 'integer', scope: 'region', value: 1 as any,
    })).toThrow('primitive type');
  });
});

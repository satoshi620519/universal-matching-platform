import { describe, expect, it } from 'vitest';

import {
  resolveConfigurationValue,
  validateConfigurationValue,
  type ConfigurationSettingDefinition,
} from './configuration-resolution.js';

const definition: ConfigurationSettingDefinition<number> = {
  key: 'matching.discovery.max-distance',
  defaultValue: 25,
  allowedScopes: ['platform', 'deployment', 'region', 'category', 'category-region'],
};

describe('configuration resolution', () => {
  it('uses the documented specificity precedence', () => {
    expect(resolveConfigurationValue(definition, [
      { scope: 'platform', value: 30 },
      { scope: 'deployment', value: 40 },
      { scope: 'region', value: 50 },
      { scope: 'category', value: 60 },
      { scope: 'category-region', value: 70 },
    ])).toBe(70);
  });

  it('falls back through scopes and then to the typed default', () => {
    expect(resolveConfigurationValue(definition, [
      { scope: 'platform', value: 30 },
      { scope: 'region', value: 50 },
    ])).toBe(50);
    expect(resolveConfigurationValue(definition, [])).toBe(25);
  });

  it('ignores values at scopes the setting does not permit', () => {
    const deploymentOnly = {
      ...definition,
      allowedScopes: ['deployment'] as const,
    };
    expect(resolveConfigurationValue(deploymentOnly, [
      { scope: 'region', value: 99 },
    ])).toBe(25);
  });

  it('rejects explicitly invalid scope assignments', () => {
    expect(() => validateConfigurationValue(
      { ...definition, allowedScopes: ['deployment'] },
      { scope: 'region', value: 1 },
    )).toThrow('not allowed');
  });
});

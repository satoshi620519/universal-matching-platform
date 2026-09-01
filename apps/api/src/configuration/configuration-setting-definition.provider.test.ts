import { describe, expect, it } from 'vitest';
import { InMemoryConfigurationSettingDefinitionProvider } from './in-memory-configuration-setting-definition.provider.js';

describe('ConfigurationSettingDefinitionProvider', () => {
  it('returns the authoritative definition for an exact key', () => {
    const provider = new InMemoryConfigurationSettingDefinitionProvider([{
      key: 'matching.max-distance', valueType: 'integer', allowedScopes: ['deployment'],
    }]);
    expect(provider.find('matching.max-distance')).toMatchObject({ valueType: 'integer' });
    expect(provider.find('unknown')).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import { createDiscoveryPreferences, matchesDiscoveryPreferences } from './discovery-preferences.js';
import { createGeographicScope } from './geographic-scope.js';
import { createProfile } from './profile.js';

const candidate = createProfile({
  id: 'p1', accountId: 'a1', categoryId: 'dating',
  fields: { role: 'designer', experience: 8 },
  geographicScope: createGeographicScope({ kind: 'global' }),
});

describe('discovery preferences', () => {
  it('filters candidates with typed field preferences', () => {
    const preferences = createDiscoveryPreferences({ filters: [
      { field: 'role', operator: 'equals', value: 'designer' },
      { field: 'experience', operator: 'minimum', value: 5 },
    ] });
    expect(matchesDiscoveryPreferences(candidate, preferences)).toBe(true);
  });

  it('rejects invalid preference definitions', () => {
    expect(() => createDiscoveryPreferences({ filters: [
      { field: '', operator: 'equals', value: 'designer' },
    ] })).toThrow('discovery preference field must not be empty');
  });
});

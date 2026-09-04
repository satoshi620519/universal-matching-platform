import { describe, expect, it } from 'vitest';
import { createDiscoverySearch, matchesDiscoverySearch } from './discovery-search.js';
import { createGeographicScope } from './geographic-scope.js';
import { createProfile } from './profile.js';

const profile = createProfile({
  id: 'p1', accountId: 'a1', categoryId: 'dating',
  fields: { displayName: 'Alice Example', role: 'Designer' },
  geographicScope: createGeographicScope({ kind: 'global' }),
});

describe('discovery search', () => {
  it('matches configured text fields case-insensitively', () => {
    const search = createDiscoverySearch({ term: 'ALICE', fields: ['displayName'] });
    expect(matchesDiscoverySearch(profile, search)).toBe(true);
    expect(matchesDiscoverySearch(profile, createDiscoverySearch({ term: 'developer', fields: ['role'] }))).toBe(false);
  });

  it('rejects ambiguous empty search definitions', () => {
    expect(() => createDiscoverySearch({ term: ' ', fields: ['displayName'] })).toThrow('discovery search term must not be empty');
    expect(() => createDiscoverySearch({ term: 'alice', fields: [] })).toThrow('discovery search fields must not be empty');
  });
});

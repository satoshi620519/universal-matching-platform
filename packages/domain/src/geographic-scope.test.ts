import { describe, expect, it } from 'vitest';

import { createGeographicScope } from './geographic-scope.js';

describe('geographic scope', () => {
  it('normalizes country, region, and locality identifiers for a city scope', () => {
    expect(createGeographicScope({
      kind: 'city',
      countryCode: ' jp ',
      regionCode: ' 13 ',
      localityCode: ' tokyo ',
    })).toEqual({
      kind: 'city',
      countryCode: 'JP',
      regionCode: '13',
      localityCode: 'tokyo',
    });
  });

  it('rejects an empty locality identifier', () => {
    expect(() => createGeographicScope({
      kind: 'city',
      countryCode: 'JP',
      regionCode: '13',
      localityCode: '  ',
    })).toThrow('localityCode must not be empty');
  });

  it('preserves existing global, country, and region scopes', () => {
    expect(createGeographicScope({ kind: 'global' })).toEqual({ kind: 'global' });
    expect(createGeographicScope({ kind: 'country', countryCode: ' jp ' })).toEqual({ kind: 'country', countryCode: 'JP' });
    expect(createGeographicScope({ kind: 'region', countryCode: ' jp ', regionCode: ' 13 ' })).toEqual({
      kind: 'region',
      countryCode: 'JP',
      regionCode: '13',
    });
  });
});

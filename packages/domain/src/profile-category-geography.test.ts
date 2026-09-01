import { describe, expect, it } from 'vitest';
import { createCategory } from './category.js';
import { createGeographicScope } from './geographic-scope.js';
import { createProfile } from './profile.js';

describe('profile/category/geography baseline', () => {
  it('creates a reusable category identity', () => {
    expect(createCategory({ id: ' category-1 ', key: ' dating ', displayName: ' Dating ' })).toEqual({
      id: 'category-1', key: 'dating', displayName: 'Dating',
    });
  });

  it('rejects invalid geographic country scope', () => {
    expect(() => createGeographicScope({ kind: 'country', countryCode: 'JPN' })).toThrow('ISO 3166-1');
  });

  it('creates a profile with primitive configurable fields and a geographic scope', () => {
    const scope = createGeographicScope({ kind: 'region', countryCode: 'jp', regionCode: '13' });
    expect(createProfile({
      id: 'profile-1', accountId: 'account-1', categoryId: 'category-1',
      fields: { displayName: 'Satoshi', age: 20, discoverable: true, bio: null },
      geographicScope: scope,
    }).fields).toEqual({ displayName: 'Satoshi', age: 20, discoverable: true, bio: null });
  });

  it('rejects structured values in configurable profile fields', () => {
    expect(() => createProfile({
      id: 'profile-1', accountId: 'account-1', categoryId: 'category-1',
      fields: { unsafe: {} as never },
      geographicScope: { kind: 'global' },
    })).toThrow('primitive');
  });
});

import { describe, expect, it } from 'vitest';
import { createDiscoveryQuery } from './discovery-query.js';

const scope = { kind: 'country', countryCode: 'JP' } as const;

describe('DiscoveryQuery', () => {
  it('accepts a bounded category/geography query', () => {
    expect(createDiscoveryQuery({ subjectAccountId: 'a1', categoryId: 'c1', geographicScope: scope, limit: 20 }))
      .toMatchObject({ subjectAccountId: 'a1', limit: 20 });
  });
  it('rejects invalid pagination limits', () => {
    expect(() => createDiscoveryQuery({ subjectAccountId: 'a1', categoryId: 'c1', geographicScope: scope, limit: 0 })).toThrow('between 1 and 100');
    expect(() => createDiscoveryQuery({ subjectAccountId: 'a1', categoryId: 'c1', geographicScope: scope, limit: 101 })).toThrow('between 1 and 100');
  });
  it('rejects missing identity and empty cursors', () => {
    expect(() => createDiscoveryQuery({ subjectAccountId: ' ', categoryId: 'c1', geographicScope: scope, limit: 1 })).toThrow('subjectAccountId');
    expect(() => createDiscoveryQuery({ subjectAccountId: 'a1', categoryId: 'c1', geographicScope: scope, limit: 1, cursor: ' ' })).toThrow('cursor');
  });
});

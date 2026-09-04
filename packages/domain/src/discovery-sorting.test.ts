import { describe, expect, it } from 'vitest';
import { createDiscoverySort } from './discovery-sorting.js';

describe('discovery sorting', () => {
  it('defaults to stable id ordering', () => {
    expect(createDiscoverySort()).toEqual({ key: 'id', direction: 'asc' });
  });

  it('accepts compatibility sorting', () => {
    expect(createDiscoverySort({ key: 'compatibilityScore', direction: 'desc' }))
      .toEqual({ key: 'compatibilityScore', direction: 'desc' });
  });

  it('rejects invalid sorting input', () => {
    expect(() => createDiscoverySort({ key: 'unknown' as never, direction: 'asc' })).toThrow('discovery sort key is invalid');
  });
});

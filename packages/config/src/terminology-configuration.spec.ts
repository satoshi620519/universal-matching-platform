import { describe, expect, it } from 'vitest';
import { normalizeTerminologyConfiguration, terminologyLabel } from './terminology-configuration.js';

describe('terminology configuration', () => {
  it('keeps only non-empty configured labels', () => {
    expect(normalizeTerminologyConfiguration({ terms: { match: 'Connection', user: '   ' } }))
      .toEqual({ terms: { match: 'Connection' } });
  });

  it('falls back when a term is not configured', () => {
    expect(terminologyLabel({ terms: { match: 'Connection' } }, 'matches', 'Matches')).toBe('Matches');
  });
});

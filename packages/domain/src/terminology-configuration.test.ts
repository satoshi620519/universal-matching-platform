import { describe, expect, it } from 'vitest';
import { normalizeTerminologyConfiguration, resolveTerminologyLabel, terminologyKeys, validateTerminologyConfiguration } from './terminology-configuration.js';

describe('TerminologyConfiguration', () => {
  it('defines the documented stable implementation keys', () => {
    expect(terminologyKeys).toEqual(['user','profile','discovery','match','matches','message','messages']);
  });
  it('rejects unsupported keys without changing implementation identifiers', () => {
    expect(() => validateTerminologyConfiguration({ stranger: 'Member' } as never)).toThrow('stable key');
  });
  it('discards empty labels and preserves explicit fallbacks', () => {
    const normalized = normalizeTerminologyConfiguration({ user: '  Member  ', match: '   ' });
    expect(normalized).toEqual({ user: 'Member' });
    expect(resolveTerminologyLabel(normalized, 'user', 'User')).toBe('Member');
    expect(resolveTerminologyLabel(normalized, 'match', 'Match')).toBe('Match');
  });
});

import { describe, expect, it } from 'vitest';

import { normalizeEmailProviderSubject } from './email-provider-subject.js';

describe('normalizeEmailProviderSubject', () => {
  it('trims surrounding whitespace and lowercases only the domain', () => {
    expect(normalizeEmailProviderSubject(' User+Tag@Example.TEST ')).toBe(
      'User+Tag@example.test',
    );
  });

  it('rejects blank, malformed and whitespace-containing values', () => {
    expect(normalizeEmailProviderSubject('')).toBeNull();
    expect(normalizeEmailProviderSubject('user.example')).toBeNull();
    expect(normalizeEmailProviderSubject('user @example.test')).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';

import { resolveEffectiveSafetyRestriction } from './effective-safety-restriction.js';

const base = {
  accountId: 'account-1',
  reasonCategory: 'policy',
  status: 'active' as const,
  effectiveAt: '2026-08-01T00:00:00.000Z',
};

describe('resolveEffectiveSafetyRestriction', () => {
  it('returns none when there are no active enforcement records', () => {
    expect(resolveEffectiveSafetyRestriction([], 'general')).toBe('none');
  });

  it('applies communication restriction only to communication scope', () => {
    const records = [{
      ...base,
      id: '1',
      restriction: 'communication-restricted' as const,
    }];
    expect(resolveEffectiveSafetyRestriction(records, 'general')).toBe('none');
    expect(resolveEffectiveSafetyRestriction(records, 'communication')).toBe('communication-restricted');
  });

  it('allows a broader feature restriction to dominate communication restriction', () => {
    const records = [
      { ...base, id: '1', restriction: 'communication-restricted' as const },
      { ...base, id: '2', restriction: 'feature-restricted' as const },
    ];
    expect(resolveEffectiveSafetyRestriction(records, 'communication')).toBe('communication-restricted');
    expect(resolveEffectiveSafetyRestriction(records, 'general')).toBe('feature-restricted');
  });

  it('always lets suspension dominate narrower restrictions', () => {
    const records = [
      { ...base, id: '1', restriction: 'feature-restricted' as const },
      { ...base, id: '2', restriction: 'suspended' as const },
    ];
    expect(resolveEffectiveSafetyRestriction(records, 'communication')).toBe('suspended');
  });
});

import { describe, expect, it } from 'vitest';
import { evaluateRuleBasedCompatibility } from './match-compatibility.js';
import { createGeographicScope } from './geographic-scope.js';
import { createProfile } from './profile.js';

const profile = (id: string, fields: Record<string, string | number | boolean | null>) => createProfile({
  id, accountId: id, categoryId: 'cat', fields, geographicScope: createGeographicScope({ kind: 'global' }),
});

describe('evaluateRuleBasedCompatibility', () => {
  it('calculates deterministic weighted scores', () => {
    const result = evaluateRuleBasedCompatibility(
      profile('subject', {}),
      profile('candidate', { role: 'designer', experience: 7 }),
      { rules: [
        { key: 'role', targetField: 'role', operator: 'equals', value: 'designer', enabled: true, weight: 3 },
        { key: 'experience', targetField: 'experience', operator: 'minimumScore', value: 10, enabled: true, weight: 1 },
      ] },
    );
    expect(result.score).toBe(75);
    expect(result.eligible).toBe(true);
    expect(result.reasons).toEqual([{ ruleKey: 'role', passed: true }, { ruleKey: 'experience', passed: false }]);
  });

  it('defaults to full compatibility when no rules are enabled', () => {
    expect(evaluateRuleBasedCompatibility(profile('a', {}), profile('b', {}), { rules: [] }))
      .toEqual({ eligible: true, score: 100, reasons: [] });
  });
});

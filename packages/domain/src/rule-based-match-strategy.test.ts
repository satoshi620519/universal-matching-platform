import { describe, expect, it } from 'vitest';
import { RuleBasedMatchStrategy } from './rule-based-match-strategy.js';
import { createProfile } from './profile.js';
import { createGeographicScope } from './geographic-scope.js';

const profile = (id: string, fields: Record<string, string | number | boolean | null>) => createProfile({
  id, accountId: id, categoryId: 'dating', fields, geographicScope: createGeographicScope({ kind: 'global' }),
});

describe('RuleBasedMatchStrategy', () => {
  it('adapts existing compatibility evaluation into the MatchStrategy contract', () => {
    const strategy = new RuleBasedMatchStrategy({ rules: [
      { key: 'role', targetField: 'role', operator: 'equals', value: 'designer', enabled: true },
    ] });
    expect(strategy.decide({ subject: profile('s', {}), candidate: profile('c', { role: 'designer' }) }))
      .toEqual({ kind: 'eligible', strategy: 'rule-based' });
    expect(strategy.decide({ subject: profile('s', {}), candidate: profile('c', { role: 'developer' }) }))
      .toEqual({ kind: 'no_match', strategy: 'rule-based', reason: 'no_matching_rules_passed' });
  });
});

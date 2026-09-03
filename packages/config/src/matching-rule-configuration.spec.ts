import { describe, expect, it } from 'vitest';
import { normalizeMatchingRuleConfiguration } from './matching-rule-configuration.js';

describe('matching rule configuration', () => {
  it('keeps valid stable rules and rejects invalid or duplicate keys', () => {
    expect(normalizeMatchingRuleConfiguration({ rules: [
      { key:'age', field:'profile.age', operator:'minimumScore', value:70, enabled:true, weight:2 },
      { key:'age', field:'profile.age', operator:'minimumScore', value:80, enabled:true },
      { key:'', field:'x', operator:'equals', value:true, enabled:true },
    ]})).toEqual({ rules:[{ key:'age', field:'profile.age', operator:'minimumScore', value:70, enabled:true, weight:2 }] });
  });
});

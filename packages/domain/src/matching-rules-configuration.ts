export const MATCHING_RULE_OPERATORS = [
  'equals',
  'notEquals',
  'contains',
  'withinDistance',
  'minimumScore',
] as const;

export type MatchingRuleOperator = typeof MATCHING_RULE_OPERATORS[number];
export type MatchingRuleValue = string | number | boolean;

/** Purchaser-configurable matching metadata; runtime interpretation remains engine-owned. */
export interface MatchingRuleConfiguration {
  readonly key: string;
  readonly targetField: string;
  readonly operator: MatchingRuleOperator;
  readonly value: MatchingRuleValue;
  readonly enabled: boolean;
  readonly weight?: number;
}

export interface MatchingRulesConfiguration {
  readonly rules: readonly MatchingRuleConfiguration[];
}

export function validateMatchingRulesConfiguration(configuration: MatchingRulesConfiguration): void {
  const keys = configuration.rules.map((rule) => rule.key.trim());
  if (keys.some((key) => !key)) throw new Error('matching rule key must not be empty');
  if (new Set(keys).size !== keys.length) throw new Error('matching rule keys must be unique');
  for (const rule of configuration.rules) {
    if (!rule.targetField.trim()) throw new Error('matching rule targetField must not be empty');
    if (!MATCHING_RULE_OPERATORS.includes(rule.operator)) throw new Error('matching rule operator is invalid');
    if (typeof rule.value !== 'string' && typeof rule.value !== 'number' && typeof rule.value !== 'boolean') throw new Error('matching rule value must be typed');
    if (typeof rule.value === 'number' && !Number.isFinite(rule.value)) throw new Error('matching rule numeric value must be finite');
    if (rule.weight !== undefined && (!Number.isFinite(rule.weight) || rule.weight < 0)) throw new Error('matching rule weight must be a non-negative finite number');
  }
}

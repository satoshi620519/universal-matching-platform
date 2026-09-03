export type MatchingRuleOperator = 'equals' | 'notEquals' | 'contains' | 'withinDistance' | 'minimumScore';

export interface MatchingRule {
  key: string;
  field: string;
  operator: MatchingRuleOperator;
  value: string | number | boolean;
  enabled: boolean;
  weight?: number;
}

export interface MatchingRuleConfiguration {
  rules: readonly MatchingRule[];
}

const operators = new Set<MatchingRuleOperator>(['equals','notEquals','contains','withinDistance','minimumScore']);

export function normalizeMatchingRuleConfiguration(
  value: MatchingRuleConfiguration | undefined,
): MatchingRuleConfiguration | undefined {
  if (!value) return undefined;
  const seen = new Set<string>();
  const rules = value.rules.flatMap((rule) => {
    const key = rule.key.trim();
    const field = rule.field.trim();
    if (!key || !field || seen.has(key) || !operators.has(rule.operator)) return [];
    if (typeof rule.value === 'string' && !rule.value.trim()) return [];
    seen.add(key);
    const weight = typeof rule.weight === 'number' && Number.isFinite(rule.weight) && rule.weight >= 0 ? rule.weight : undefined;
    return [{ ...rule, key, field, value: typeof rule.value === 'string' ? rule.value.trim() : rule.value, enabled: rule.enabled !== false, weight }];
  });
  return rules.length ? { rules } : undefined;
}

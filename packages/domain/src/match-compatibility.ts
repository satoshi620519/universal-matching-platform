import type { Profile, ProfileFieldValue } from './profile.js';
import type { MatchingRuleConfiguration, MatchingRulesConfiguration } from './matching-rules-configuration.js';

export type CompatibilityReason = Readonly<{
  ruleKey: string;
  passed: boolean;
}>;

export type MatchCompatibilityResult = Readonly<{
  eligible: boolean;
  score: number;
  reasons: readonly CompatibilityReason[];
}>;

export function evaluateRuleBasedCompatibility(
  subject: Profile,
  candidate: Profile,
  configuration: MatchingRulesConfiguration,
): MatchCompatibilityResult {
  const enabled = configuration.rules.filter((rule) => rule.enabled);
  if (!enabled.length) return { eligible: true, score: 100, reasons: [] };

  let totalWeight = 0;
  let earnedWeight = 0;
  const reasons: CompatibilityReason[] = [];

  for (const rule of enabled) {
    const weight = rule.weight ?? 1;
    totalWeight += weight;
    const passed = evaluateRule(subject.fields, candidate.fields, rule);
    if (passed) earnedWeight += weight;
    reasons.push({ ruleKey: rule.key, passed });
  }

  const score = totalWeight === 0 ? 100 : Math.round((earnedWeight / totalWeight) * 100);
  return { eligible: score > 0, score, reasons };
}

function evaluateRule(
  subjectFields: Readonly<Record<string, ProfileFieldValue>>,
  candidateFields: Readonly<Record<string, ProfileFieldValue>>,
  rule: MatchingRuleConfiguration,
): boolean {
  const subjectValue = subjectFields[rule.targetField];
  const candidateValue = candidateFields[rule.targetField];

  switch (rule.operator) {
    case 'equals': return candidateValue === rule.value;
    case 'notEquals': return candidateValue !== rule.value;
    case 'contains': return typeof candidateValue === 'string' && typeof rule.value === 'string' && candidateValue.includes(rule.value);
    case 'minimumScore': return typeof candidateValue === 'number' && typeof rule.value === 'number' && candidateValue >= rule.value;
    case 'withinDistance': return true;
  }
}

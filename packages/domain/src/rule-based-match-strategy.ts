import { evaluateRuleBasedCompatibility } from './match-compatibility.js';
import { createMatchDecision, type MatchDecision, type MatchStrategy, type MatchStrategyContext } from './match-strategy.js';
import type { MatchingRulesConfiguration } from './matching-rules-configuration.js';

export class RuleBasedMatchStrategy implements MatchStrategy {
  readonly key = 'rule-based';

  constructor(private readonly configuration: MatchingRulesConfiguration) {}

  decide(context: MatchStrategyContext): MatchDecision {
    const result = evaluateRuleBasedCompatibility(context.subject, context.candidate, this.configuration);
    return createMatchDecision({
      kind: result.eligible ? 'eligible' : 'no_match',
      strategy: this.key,
      ...(result.eligible ? {} : { reason: 'no_matching_rules_passed' }),
    });
  }
}

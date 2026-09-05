export const MATCH_STRATEGY_KEYS = ['rule-based'] as const;

export type MatchStrategyKey = typeof MATCH_STRATEGY_KEYS[number];

export interface MatchStrategyConfiguration {
  readonly strategy: MatchStrategyKey;
}

export const DEFAULT_MATCH_STRATEGY_CONFIGURATION: MatchStrategyConfiguration = Object.freeze({
  strategy: 'rule-based',
});

export function createMatchStrategyConfiguration(
  input: MatchStrategyConfiguration = DEFAULT_MATCH_STRATEGY_CONFIGURATION,
): MatchStrategyConfiguration {
  if (!MATCH_STRATEGY_KEYS.includes(input.strategy)) throw new Error('match strategy is invalid');
  return { strategy: input.strategy };
}

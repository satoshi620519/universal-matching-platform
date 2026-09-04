import type { MatchStrategy } from './match-strategy.js';

export class MatchStrategyRegistry {
  private readonly byKey = new Map<string, MatchStrategy>();

  constructor(strategies: readonly MatchStrategy[]) {
    for (const strategy of strategies) {
      if (!strategy.key.trim()) throw new Error('match strategy key must not be empty');
      if (this.byKey.has(strategy.key)) throw new Error('match strategy keys must be unique');
      this.byKey.set(strategy.key, strategy);
    }
  }

  select(key: string): MatchStrategy {
    const strategy = this.byKey.get(key);
    if (!strategy) throw new Error(`unknown match strategy: ${key}`);
    return strategy;
  }

  keys(): readonly string[] {
    return [...this.byKey.keys()].sort();
  }
}

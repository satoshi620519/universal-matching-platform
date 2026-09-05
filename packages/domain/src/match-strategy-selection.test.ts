import { describe, expect, it } from 'vitest';
import { MatchStrategyRegistry } from './match-strategy-selection.js';
import type { MatchStrategy } from './match-strategy.js';

const strategy = (key: string): MatchStrategy => ({ key, decide: () => ({ kind: 'eligible', strategy: key }) });

describe('MatchStrategyRegistry', () => {
  it('selects strategies by stable key', () => {
    const registry = new MatchStrategyRegistry([strategy('weighted'), strategy('strict')]);
    expect(registry.select('weighted').key).toBe('weighted');
    expect(registry.keys()).toEqual(['strict', 'weighted']);
  });

  it('rejects duplicate and unknown strategy keys', () => {
    expect(() => new MatchStrategyRegistry([strategy('same'), strategy('same')])).toThrow('match strategy keys must be unique');
    expect(() => new MatchStrategyRegistry([strategy('known')]).select('missing')).toThrow('unknown match strategy: missing');
  });
});

import { describe, expect, it } from 'vitest';
import { createMatchStrategyConfiguration } from './match-strategy-configuration.js';

describe('match strategy configuration', () => {
  it('defaults to the stable rule-based strategy', () => {
    expect(createMatchStrategyConfiguration()).toEqual({ strategy: 'rule-based' });
  });

  it('rejects unknown strategy keys', () => {
    expect(() => createMatchStrategyConfiguration({ strategy: 'unknown' as never }))
      .toThrow('match strategy is invalid');
  });
});

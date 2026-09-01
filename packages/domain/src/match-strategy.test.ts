import { describe, expect, it } from 'vitest';
import { createMatchDecision, type MatchStrategy } from './match-strategy.js';

describe('match strategy decision contract', () => {
  it('requires a named strategy', () => {
    expect(() => createMatchDecision({ kind: 'eligible', strategy: ' ' })).toThrow('strategy');
  });
  it('preserves explicit eligible and no-match decisions', () => {
    expect(createMatchDecision({ kind: 'eligible', strategy: 'baseline' })).toEqual({ kind: 'eligible', strategy: 'baseline' });
    expect(createMatchDecision({ kind: 'no_match', strategy: 'baseline', reason: 'incompatible' })).toMatchObject({ kind: 'no_match' });
  });
  it('allows interchangeable strategy implementations behind the same contract', () => {
    const strategy: MatchStrategy = { key: 'baseline', decide: () => ({ kind: 'eligible', strategy: 'baseline' }) };
    expect(strategy.decide({ subject: {} as never, candidate: {} as never }).kind).toBe('eligible');
  });
});

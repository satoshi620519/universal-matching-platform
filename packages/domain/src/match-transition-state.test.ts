import { describe, expect, it } from 'vitest';
import { resolveMatchTransition } from './match-transition-state.js';

describe('match transition state semantics', () => {
  it('matches only on reciprocal likes', () => {
    expect(resolveMatchTransition('like', 'like')).toMatchObject({ state: 'matched', mutual: true });
  });
  it('keeps non-mutual and pass interactions pending', () => {
    expect(resolveMatchTransition('like', undefined)).toMatchObject({ state: 'pending', mutual: false });
    expect(resolveMatchTransition('pass', 'like')).toMatchObject({ state: 'pending', mutual: false });
  });
});

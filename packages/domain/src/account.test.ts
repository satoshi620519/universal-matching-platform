import { describe, expect, it } from 'vitest';
import { canTransitionAccountState } from './account.js';

describe('account lifecycle', () => {
  it('allows onboarding to active', () => {
    expect(canTransitionAccountState('pending-onboarding', 'active')).toBe(true);
  });

  it('allows restriction and later restoration', () => {
    expect(canTransitionAccountState('active', 'restricted')).toBe(true);
    expect(canTransitionAccountState('restricted', 'active')).toBe(true);
  });

  it('requires deletion to pass through pending deletion', () => {
    expect(canTransitionAccountState('active', 'deleted-anonymized')).toBe(false);
    expect(canTransitionAccountState('pending-deletion', 'deleted-anonymized')).toBe(true);
  });

  it('does not allow transitions out of anonymized state', () => {
    expect(canTransitionAccountState('deleted-anonymized', 'active')).toBe(false);
  });
});

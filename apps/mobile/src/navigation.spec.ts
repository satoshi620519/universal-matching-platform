import { describe, expect, it } from 'vitest';
import { canAccessDestination, requiresAuthentication } from './navigation.js';

describe('mobile navigation access boundary', () => {
  it('allows public destinations without a session', () => {
    expect(canAccessDestination('sign-in', false)).toBe(true);
  });

  it('rejects protected destinations without a session', () => {
    expect(canAccessDestination('profile', false)).toBe(false);
    expect(canAccessDestination('discovery', false)).toBe(false);
  });

  it('allows protected destinations with a session', () => {
    expect(canAccessDestination('matches', true)).toBe(true);
  });

  it('identifies protected destinations explicitly', () => {
    expect(requiresAuthentication('settings')).toBe(true);
    expect(requiresAuthentication('verification')).toBe(false);
  });
});

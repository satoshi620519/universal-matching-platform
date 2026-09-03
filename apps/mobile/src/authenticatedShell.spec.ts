import { describe, expect, it } from 'vitest';
import { canAccessDestination } from './navigation.js';

describe('authenticated shell destinations', () => {
  it('keeps all initial shell destinations protected', () => {
    for (const destination of ['home','discovery','matches','conversations','profile','settings','safety'] as const) {
      expect(canAccessDestination(destination, false)).toBe(false);
      expect(canAccessDestination(destination, true)).toBe(true);
    }
  });
});

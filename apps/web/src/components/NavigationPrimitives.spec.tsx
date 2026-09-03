import { describe, expect, it } from 'vitest';
import { BottomNavigation, HeaderNavigation } from './NavigationPrimitives';

describe('navigation primitive contract', () => {
  it('exports responsive header and bottom navigation', () => {
    expect(typeof HeaderNavigation).toBe('function');
    expect(typeof BottomNavigation).toBe('function');
  });
});

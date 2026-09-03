import { describe, expect, it } from 'vitest';
import { BottomNavigation, HeaderNavigation } from './NavigationPrimitives';

describe('navigation primitives', () => {
  it('exports header and bottom navigation components', () => {
    expect(typeof HeaderNavigation).toBe('function');
    expect(typeof BottomNavigation).toBe('function');
  });
});

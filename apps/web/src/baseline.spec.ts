import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('web baseline', () => {
  it('keeps a mobile navigation path available when the header navigation collapses', () => {
    const source = readFileSync(resolve(__dirname, 'components/NavigationPrimitives.tsx'), 'utf8');
    expect(source).toContain('ResponsiveNavigation');
    expect(source).toContain('<BottomNavigation');
  });
});

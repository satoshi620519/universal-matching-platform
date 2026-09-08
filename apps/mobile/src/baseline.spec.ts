import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('mobile runtime baseline', () => {
  it('defines Expo Router as the executable mobile entry boundary', () => {
    const pkg = readFileSync(resolve(__dirname, '../package.json'), 'utf8');
    expect(pkg).toContain('expo-router/entry');
    expect(pkg).toContain('"ios"');
  });
});

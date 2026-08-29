import { describe, expect, it } from 'vitest';
import { createEntityId, createInstantString } from './index.js';

describe('domain primitive edge cases', () => {
  it('normalizes surrounding whitespace from ids', () => {
    expect(createEntityId('\tmember-42\n')).toBe('member-42');
  });

  it('normalizes an instant with an explicit offset', () => {
    expect(createInstantString('2026-01-01T09:00:00+09:00')).toBe('2026-01-01T00:00:00.000Z');
  });
});

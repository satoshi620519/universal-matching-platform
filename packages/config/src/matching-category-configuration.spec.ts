import { describe, expect, it } from 'vitest';
import { normalizeMatchingCategoryConfiguration } from './matching-category-configuration.js';

describe('matching category configuration', () => {
  it('normalizes labels and removes invalid or duplicate keys', () => {
    expect(normalizeMatchingCategoryConfiguration({ categories: [
      { key: 'dating', label: ' Dating ', enabled: true },
      { key: 'dating', label: 'Duplicate', enabled: true },
      { key: '', label: 'Invalid', enabled: true },
    ]})).toEqual({ categories: [{ key: 'dating', label: 'Dating', description: undefined, enabled: true }] });
  });
});

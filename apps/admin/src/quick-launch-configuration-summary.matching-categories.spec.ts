import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';

describe('matching category snapshot summary', () => {
  it('summarizes configured and enabled categories', () => {
    const summary = summarizeQuickLaunchConfiguration({
      snapshot: { applicationName: 'Community', matchingCategories: { categories: [
        { key: 'dating', label: 'Dating', enabled: true },
        { key: 'networking', label: 'Networking', enabled: false },
      ] } },
    });
    expect(summary.matchingCategoryCount).toBe(2);
    expect(summary.enabledMatchingCategoryCount).toBe(1);
    expect(summary.matchingCategoryKeys).toEqual(['dating','networking']);
  });

  it('falls back to legacy categories and preserves missing metadata', () => {
    expect(summarizeQuickLaunchConfiguration({ snapshot: { categories: [{ key: 'friendship', displayName: 'Friendship' }] } }).matchingCategoryKeys)
      .toEqual(['friendship']);
    expect(summarizeQuickLaunchConfiguration({ snapshot: {} }).matchingCategoryCount).toBeUndefined();
  });
});

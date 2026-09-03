import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';

describe('matching category snapshot summary', () => {
  it('summarizes configured and enabled categories', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: { matchingCategories: { categories: [{ key: 'dating', label: 'Dating', enabled: true }, { key: 'friends', label: 'Friends', enabled: false }] } } });
    expect(summary.matchingCategoryCount).toBe(2);
    expect(summary.enabledMatchingCategoryCount).toBe(1);
    expect(summary.matchingCategoryKeys).toEqual(['dating', 'friends']);
  });

  it('falls back to legacy categories', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: { categories: [{ key: 'legacy', enabled: true }] } });
    expect(summary.matchingCategoryKeys).toEqual(['legacy']);
  });
});

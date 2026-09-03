import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';

describe('unified configuration snapshot summary', () => {
  it('projects all configuration engine domains together', () => {
    const summary = summarizeQuickLaunchConfiguration({
      snapshot: {
        featureVisibility: { features: [{ key: 'chat', enabled: true }, { key: 'video', enabled: false }] },
        terminology: { terms: { user: 'Member', match: 'Connection' } },
        matchingCategories: { categories: [{ key: 'dating', label: 'Dating', enabled: true }, { key: 'friends', label: 'Friends', enabled: false }] },
        matchingRules: { rules: [{ key: 'distance', field: 'location', operator: 'withinDistance', value: 20, enabled: true }, { key: 'interest', field: 'interests', operator: 'contains', value: 'music', enabled: false }] },
      },
    });

    expect(summary.visibleFeatureCount).toBe(1);
    expect(summary.visibleFeatureKeys).toEqual(['chat']);
    expect(summary.terminologyCount).toBe(2);
    expect(summary.terminology).toEqual({ user: 'Member', match: 'Connection' });
    expect(summary.matchingCategoryCount).toBe(2);
    expect(summary.enabledMatchingCategoryCount).toBe(1);
    expect(summary.matchingCategoryKeys).toEqual(['dating', 'friends']);
    expect(summary.matchingRuleCount).toBe(2);
    expect(summary.enabledMatchingRuleCount).toBe(1);
    expect(summary.matchingRuleKeys).toEqual(['distance', 'interest']);
  });

  it('keeps all new projections absent for legacy snapshots', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: {} });
    expect(summary.visibleFeatureCount).toBeUndefined();
    expect(summary.terminologyCount).toBeUndefined();
    expect(summary.matchingCategoryCount).toBeUndefined();
    expect(summary.matchingRuleCount).toBeUndefined();
  });
});

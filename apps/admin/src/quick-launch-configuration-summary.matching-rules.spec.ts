import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';

describe('matching rule snapshot summary', () => {
  it('summarizes configured and enabled rules', () => {
    const summary = summarizeQuickLaunchConfiguration({
      snapshot: { matchingRules: { rules: [
        { key: 'distance', field: 'location', operator: 'withinDistance', value: 20, enabled: true },
        { key: 'interest', field: 'interests', operator: 'contains', value: 'music', enabled: false },
      ] } },
    });
    expect(summary.matchingRuleCount).toBe(2);
    expect(summary.enabledMatchingRuleCount).toBe(1);
    expect(summary.matchingRuleKeys).toEqual(['distance','interest']);
  });

  it('keeps rule metadata absent for older snapshots', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: {} });
    expect(summary.matchingRuleCount).toBeUndefined();
    expect(summary.enabledMatchingRuleCount).toBeUndefined();
    expect(summary.matchingRuleKeys).toBeUndefined();
  });
});

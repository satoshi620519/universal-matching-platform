import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';

describe('feature visibility snapshot summary', () => {
  it('projects only enabled feature keys', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: { featureVisibility: { features: [{ key: 'chat', enabled: true }, { key: 'video', enabled: false }, { key: 1, enabled: true }] } } });
    expect(summary.visibleFeatureCount).toBe(1);
    expect(summary.visibleFeatureKeys).toEqual(['chat']);
  });

  it('keeps feature metadata absent when legacy snapshots omit it', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: {} });
    expect(summary.visibleFeatureCount).toBeUndefined();
    expect(summary.visibleFeatureKeys).toBeUndefined();
  });
});

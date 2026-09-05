import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary';

describe('QuickLaunch configuration summary', () => {
  it('derives feature visibility counts and enabled keys from an immutable snapshot', () => {
    const summary = summarizeQuickLaunchConfiguration({
      version: 2,
      snapshot: {
        applicationName: 'Example',
        primaryColor: '#123456',
        featureVisibility: { features: [
          { key: 'matching', enabled: true },
          { key: 'chat', enabled: false },
          { key: 'verification', enabled: true },
        ] },
      },
    });
    expect(summary.visibleFeatureCount).toBe(2);
    expect(summary.visibleFeatureKeys).toEqual(['matching', 'verification']);
  });
});

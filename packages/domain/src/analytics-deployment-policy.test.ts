import { describe, expect, it } from 'vitest';
import {
  isValidAnalyticsDeploymentPolicy,
  shouldCollectNonEssentialAnalytics,
  supportsAnalyticsRetentionPeriod,
} from './analytics-deployment-policy.js';

describe('analytics deployment policy', () => {
  it('supports only explicitly configured retention periods', () => {
    expect(supportsAnalyticsRetentionPeriod(7)).toBe(true);
    expect(supportsAnalyticsRetentionPeriod(30)).toBe(true);
    expect(supportsAnalyticsRetentionPeriod(90)).toBe(true);
    expect(supportsAnalyticsRetentionPeriod(365)).toBe(true);
    expect(supportsAnalyticsRetentionPeriod(60)).toBe(false);
  });

  it('allows deployment policy to disable non-essential analytics', () => {
    expect(
      shouldCollectNonEssentialAnalytics({
        retentionDays: 30,
        nonEssentialAnalyticsEnabled: false,
      }),
    ).toBe(false);
  });

  it('validates the complete deployment policy', () => {
    expect(
      isValidAnalyticsDeploymentPolicy({
        retentionDays: 90,
        nonEssentialAnalyticsEnabled: true,
      }),
    ).toBe(true);
  });
});

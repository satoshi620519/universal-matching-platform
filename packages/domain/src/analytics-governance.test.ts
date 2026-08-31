import { describe, expect, it } from 'vitest';
import {
  canPerformAnalyticsOperation,
  isValidAnalyticsAccessPolicy,
} from './analytics-governance.js';

describe('analytics governance access policy', () => {
  it('controls analytics operations by role', () => {
    expect(canPerformAnalyticsOperation('viewer', 'view')).toBe(true);
    expect(canPerformAnalyticsOperation('viewer', 'export')).toBe(false);
    expect(canPerformAnalyticsOperation('analyst', 'export')).toBe(true);
    expect(canPerformAnalyticsOperation('analyst', 'configure-dashboard')).toBe(false);
    expect(canPerformAnalyticsOperation('administrator', 'configure-retention')).toBe(true);
  });

  it('validates policy declarations against the canonical access rules', () => {
    expect(
      isValidAnalyticsAccessPolicy({
        role: 'analyst',
        operation: 'export',
        allowed: true,
      }),
    ).toBe(true);

    expect(
      isValidAnalyticsAccessPolicy({
        role: 'viewer',
        operation: 'export',
        allowed: true,
      }),
    ).toBe(false);
  });
});

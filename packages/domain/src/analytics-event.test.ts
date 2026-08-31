import { describe, expect, it } from 'vitest';
import { isValidAnalyticsEventDefinition } from './analytics-event.js';

describe('analytics event taxonomy', () => {
  const valid = {
    name: 'account_activated',
    version: 1,
    purpose: 'Measure onboarding completion',
    fields: ['source'],
    dataClassification: 'operational' as const,
    retentionDays: 90,
  };

  it('accepts a documented versioned event definition', () => {
    expect(isValidAnalyticsEventDefinition(valid)).toBe(true);
  });

  it('requires stable names, purpose and fields', () => {
    expect(isValidAnalyticsEventDefinition({ ...valid, name: 'Account Activated' })).toBe(false);
    expect(isValidAnalyticsEventDefinition({ ...valid, purpose: ' ' })).toBe(false);
    expect(isValidAnalyticsEventDefinition({ ...valid, fields: [] })).toBe(false);
  });

  it('requires a positive integer version and retention when specified', () => {
    expect(isValidAnalyticsEventDefinition({ ...valid, version: 0 })).toBe(false);
    expect(isValidAnalyticsEventDefinition({ ...valid, retentionDays: 0 })).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import {
  isValidMetricDefinition,
  supportsReportingPeriod,
} from './metric-definition.js';

describe('metric definition', () => {
  const valid = {
    name: 'account_activation_rate',
    version: 1,
    scope: 'product' as const,
    calculation: 'activated accounts divided by eligible accounts',
    supportedPeriods: ['day', 'week', 'month'] as const,
    sourceEvents: ['account_activated', 'account_created'],
  };

  it('accepts a documented versioned metric', () => {
    expect(isValidMetricDefinition(valid)).toBe(true);
  });

  it('requires calculation, periods and source events', () => {
    expect(isValidMetricDefinition({ ...valid, calculation: ' ' })).toBe(false);
    expect(isValidMetricDefinition({ ...valid, supportedPeriods: [] })).toBe(false);
    expect(isValidMetricDefinition({ ...valid, sourceEvents: [] })).toBe(false);
  });

  it('supports only configured reporting periods', () => {
    expect(supportsReportingPeriod(valid, 'week')).toBe(true);
    expect(supportsReportingPeriod(valid, 'year')).toBe(false);
  });
});

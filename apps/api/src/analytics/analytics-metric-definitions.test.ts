import { describe, expect, it } from 'vitest';
import { isValidMetricDefinition } from '@universal/domain';
import { analyticsMetricDefinitions } from './analytics-metric-definitions.js';

describe('analyticsMetricDefinitions', () => {
  it('defines valid roadmap metric contracts', () => {
    expect(analyticsMetricDefinitions).toHaveLength(7);
    expect(analyticsMetricDefinitions.every(isValidMetricDefinition)).toBe(true);
  });
});

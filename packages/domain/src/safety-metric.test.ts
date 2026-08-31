import { describe, expect, it } from 'vitest';
import {
  areDistinctSafetyMetricKinds,
  isValidSafetyMetricDefinition,
} from './safety-metric.js';

describe('safety metric definition', () => {
  it('supports aggregated identity-free safety metrics', () => {
    expect(
      isValidSafetyMetricDefinition({
        kind: 'reports-received',
        version: 1,
        aggregationLevel: 'region',
        includesIdentities: false,
      }),
    ).toBe(true);
  });

  it('rejects identity-bearing metric definitions', () => {
    expect(
      isValidSafetyMetricDefinition({
        kind: 'actions-taken',
        version: 1,
        aggregationLevel: 'category',
        includesIdentities: true,
      }),
    ).toBe(false);
  });

  it('preserves distinct operational concepts', () => {
    expect(
      areDistinctSafetyMetricKinds([
        'reports-received',
        'actions-taken',
        'confirmed-policy-violations',
      ]),
    ).toBe(true);
    expect(
      areDistinctSafetyMetricKinds(['reports-received', 'reports-received']),
    ).toBe(false);
  });
});

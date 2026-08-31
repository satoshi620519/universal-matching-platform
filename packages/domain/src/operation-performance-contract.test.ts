import { describe, expect, it } from 'vitest';
import {
  coversCriticalPerformanceJourneys,
  hasValidPerformanceTarget,
} from './operation-performance-contract.js';

describe('operational performance target contract', () => {
  it('requires a positive target and observable latency dimension', () => {
    expect(
      hasValidPerformanceTarget({
        journey: 'authentication',
        targetMilliseconds: 500,
        measuredDimensions: ['client', 'api'],
      }),
    ).toBe(true);

    expect(
      hasValidPerformanceTarget({
        journey: 'authentication',
        targetMilliseconds: 0,
        measuredDimensions: ['api'],
      }),
    ).toBe(false);
  });

  it('requires every critical journey to have an explicit target', () => {
    const targets = [
      'authentication',
      'onboarding-progression',
      'discovery-retrieval',
      'matching-action',
      'message-sending',
      'protected-capability-check',
    ].map((journey) => ({
      journey: journey as
        | 'authentication'
        | 'onboarding-progression'
        | 'discovery-retrieval'
        | 'matching-action'
        | 'message-sending'
        | 'protected-capability-check',
      targetMilliseconds: 500,
      measuredDimensions: ['api'] as const,
    }));

    expect(coversCriticalPerformanceJourneys(targets)).toBe(true);
    expect(coversCriticalPerformanceJourneys(targets.slice(0, -1))).toBe(false);
  });
});

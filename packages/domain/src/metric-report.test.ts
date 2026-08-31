import { describe, expect, it } from 'vitest';
import { isValidMetricReport, isZeroValue } from './metric-report.js';

describe('metric report result', () => {
  const base = {
    metricName: 'account_activation_rate',
    metricVersion: 1,
    period: 'week' as const,
    scope: 'global' as const,
  };

  it('distinguishes an available zero from unavailable data', () => {
    const zero = { ...base, availability: 'available' as const, value: 0 };
    const unavailable = { ...base, availability: 'unavailable' as const };

    expect(isValidMetricReport(zero)).toBe(true);
    expect(isZeroValue(zero)).toBe(true);
    expect(isValidMetricReport(unavailable)).toBe(true);
    expect(isZeroValue(unavailable)).toBe(false);
  });

  it('requires a finite value when data is available', () => {
    expect(
      isValidMetricReport({ ...base, availability: 'available' as const }),
    ).toBe(false);
    expect(
      isValidMetricReport({
        ...base,
        availability: 'available' as const,
        value: Number.NaN,
      }),
    ).toBe(false);
  });

  it('does not allow a value when data is explicitly unavailable', () => {
    expect(
      isValidMetricReport({
        ...base,
        availability: 'unavailable' as const,
        value: 0,
      }),
    ).toBe(false);
  });
});

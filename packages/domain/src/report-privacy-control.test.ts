import { describe, expect, it } from 'vitest';
import {
  isValidReportPrivacyAssessment,
  resolveReportPrivacyControl,
} from './report-privacy-control.js';

describe('analytics report privacy control', () => {
  it('suppresses sensitive reports regardless of cohort size', () => {
    expect(
      resolveReportPrivacyControl({
        cohortSize: 100,
        minimumCohortSize: 10,
        containsSensitiveData: true,
      }),
    ).toBe('suppressed');
  });

  it('aggregates reports below the configured cohort threshold', () => {
    expect(
      resolveReportPrivacyControl({
        cohortSize: 4,
        minimumCohortSize: 5,
        containsSensitiveData: false,
      }),
    ).toBe('aggregated');
  });

  it('allows sufficiently large non-sensitive reports', () => {
    expect(
      resolveReportPrivacyControl({
        cohortSize: 5,
        minimumCohortSize: 5,
        containsSensitiveData: false,
      }),
    ).toBe('visible');
  });

  it('validates non-negative cohort and positive threshold', () => {
    expect(
      isValidReportPrivacyAssessment({
        cohortSize: -1,
        minimumCohortSize: 5,
        containsSensitiveData: false,
      }),
    ).toBe(false);
  });
});

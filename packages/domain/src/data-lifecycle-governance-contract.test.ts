import { describe, expect, it } from 'vitest';
import {
  hasDerivedDataGovernance,
  hasObservableFailureAwareLifecycleJob,
  hasSensitiveEvidenceProtection,
  isExplainableDeletionState,
  isTraceableRetentionPolicyChange,
} from './data-lifecycle-governance-contract.js';

describe('data lifecycle governance contract', () => {
  it('requires derived data re-identification review and retention policy', () => {
    expect(
      hasDerivedDataGovernance({
        dataSet: 'match aggregates',
        reidentificationRiskReviewed: true,
        retentionPolicyReference: 'RET-AGG-001',
      }),
    ).toBe(true);
  });

  it('requires stricter retention and access for sensitive identity evidence', () => {
    expect(
      hasSensitiveEvidenceProtection({
        evidenceClass: 'identity-verification',
        stricterRetentionDefined: true,
        stricterAccessDefined: true,
      }),
    ).toBe(true);
  });

  it('exposes only supported deletion states for explanation', () => {
    expect(isExplainableDeletionState('requested')).toBe(true);
    expect(isExplainableDeletionState('anonymized')).toBe(true);
    expect(isExplainableDeletionState('internal-control')).toBe(false);
  });

  it('requires retention policy changes to have trace references', () => {
    expect(
      isTraceableRetentionPolicyChange({
        policyReference: 'RET-001',
        changeReference: 'CHG-123',
      }),
    ).toBe(true);
  });

  it('requires scheduled lifecycle jobs to be observable and failure-aware', () => {
    expect(
      hasObservableFailureAwareLifecycleJob({
        jobName: 'scheduled-anonymization',
        observable: true,
        failureAware: true,
      }),
    ).toBe(true);
  });
});

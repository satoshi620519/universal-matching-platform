export type DeletionState = 'requested' | 'scheduled' | 'completed' | 'anonymized' | 'retained-exception';

export interface DerivedDataPolicy {
  readonly dataSet: string;
  readonly reidentificationRiskReviewed: boolean;
  readonly retentionPolicyReference: string;
}

export interface SensitiveEvidencePolicy {
  readonly evidenceClass: string;
  readonly stricterRetentionDefined: boolean;
  readonly stricterAccessDefined: boolean;
}

export interface RetentionPolicyChange {
  readonly policyReference: string;
  readonly changeReference: string;
}

export interface LifecycleJobObservation {
  readonly jobName: string;
  readonly observable: boolean;
  readonly failureAware: boolean;
}

export function hasDerivedDataGovernance(policy: DerivedDataPolicy): boolean {
  return (
    policy.dataSet.trim().length > 0 &&
    policy.reidentificationRiskReviewed &&
    policy.retentionPolicyReference.trim().length > 0
  );
}

export function hasSensitiveEvidenceProtection(
  policy: SensitiveEvidencePolicy,
): boolean {
  return (
    policy.evidenceClass.trim().length > 0 &&
    policy.stricterRetentionDefined &&
    policy.stricterAccessDefined
  );
}

export function isExplainableDeletionState(state: string): state is DeletionState {
  return (
    state === 'requested' ||
    state === 'scheduled' ||
    state === 'completed' ||
    state === 'anonymized' ||
    state === 'retained-exception'
  );
}

export function isTraceableRetentionPolicyChange(
  change: RetentionPolicyChange,
): boolean {
  return (
    change.policyReference.trim().length > 0 &&
    change.changeReference.trim().length > 0
  );
}

export function hasObservableFailureAwareLifecycleJob(
  observation: LifecycleJobObservation,
): boolean {
  return (
    observation.jobName.trim().length > 0 &&
    observation.observable &&
    observation.failureAware
  );
}

export type OperationalSeverity = 'info' | 'warning' | 'critical';
export type OperationalState = 'healthy' | 'degraded' | 'failed';

export interface FailureSignal {
  readonly severity: OperationalSeverity;
  readonly actionable: boolean;
  readonly signalTypes: readonly ('log' | 'metric' | 'alert')[];
}

export interface RecoveryPlan {
  readonly backupDefined: boolean;
  readonly recoveryDefined: boolean;
  readonly rollbackOrRecoveryDefined: boolean;
}

export interface ObservabilityRecord {
  readonly operation: string;
  readonly correlationId?: string;
  readonly containsSensitiveContent: boolean;
}

export function hasActionableFailureSignal(signal: FailureSignal): boolean {
  return signal.actionable && signal.signalTypes.length > 0;
}

export function hasRecoveryReadiness(plan: RecoveryPlan): boolean {
  return (
    plan.backupDefined &&
    plan.recoveryDefined &&
    plan.rollbackOrRecoveryDefined
  );
}

export function hasStructuredOperationRecord(
  record: ObservabilityRecord,
): boolean {
  return record.operation.trim().length > 0 && !record.containsSensitiveContent;
}

export function supportsCorrelation(record: ObservabilityRecord): boolean {
  return (record.correlationId?.trim().length ?? 0) > 0;
}

export function isValidOperationalState(state: string): state is OperationalState {
  return state === 'healthy' || state === 'degraded' || state === 'failed';
}

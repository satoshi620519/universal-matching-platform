export interface BackgroundOperation {
  readonly name: string;
  readonly blocksUserTransaction: boolean;
}

export interface DependencyResiliencePolicy {
  readonly dependency: string;
  readonly critical: boolean;
  readonly degradedBehavior?: string;
}

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly observable: boolean;
}

export function doesNotBlockUserTransaction(
  operation: BackgroundOperation,
): boolean {
  return !operation.blocksUserTransaction;
}

export function hasDefinedDegradedBehavior(
  policy: DependencyResiliencePolicy,
): boolean {
  return (
    !policy.critical ||
    (policy.degradedBehavior?.trim().length ?? 0) > 0
  );
}

export function optionalDependencyFailureIsIsolated(
  policy: DependencyResiliencePolicy,
): boolean {
  return !policy.critical;
}

export function hasBoundedObservableRetries(
  policy: RetryPolicy,
): boolean {
  return (
    Number.isInteger(policy.maxAttempts) &&
    policy.maxAttempts > 0 &&
    policy.maxAttempts <= 10 &&
    policy.observable
  );
}

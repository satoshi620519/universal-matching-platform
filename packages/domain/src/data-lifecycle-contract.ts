export type DataLifecycleAction =
  | 'delete'
  | 'anonymize'
  | 'revoke-access'
  | 'archive';

export type RetentionExceptionReason =
  | 'legal'
  | 'security'
  | 'fraud-prevention'
  | 'safety';

export interface DataClassRetentionPolicy {
  readonly dataClass: string;
  readonly retentionPurpose: string;
  readonly policyReference: string;
}

export interface UserDeletionLifecycle {
  readonly requested: boolean;
  readonly documentedLifecycle: readonly DataLifecycleAction[];
}

export interface RetentionException {
  readonly reason: RetentionExceptionReason;
  readonly scope: string;
  readonly expiresAt?: string;
}

export interface BackupLifecycle {
  readonly expirationPolicy: string;
  readonly recoveryLifecycle: string;
}

export function hasDocumentedRetentionPolicy(
  policy: DataClassRetentionPolicy,
): boolean {
  return (
    policy.dataClass.trim().length > 0 &&
    policy.retentionPurpose.trim().length > 0 &&
    policy.policyReference.trim().length > 0
  );
}

export function hasDocumentedDeletionLifecycle(
  lifecycle: UserDeletionLifecycle,
): boolean {
  return (
    lifecycle.requested &&
    lifecycle.documentedLifecycle.length > 0 &&
    new Set(lifecycle.documentedLifecycle).size ===
      lifecycle.documentedLifecycle.length
  );
}

export function hasExplicitScopedRetentionException(
  exception: RetentionException,
): boolean {
  return (
    exception.scope.trim().length > 0 &&
    (exception.expiresAt === undefined ||
      Number.isFinite(Date.parse(exception.expiresAt)))
  );
}

export function distinguishesLifecycleActions(
  actions: readonly DataLifecycleAction[],
): boolean {
  return new Set(actions).size === actions.length;
}

export function hasBackupLifecycle(policy: BackupLifecycle): boolean {
  return (
    policy.expirationPolicy.trim().length > 0 &&
    policy.recoveryLifecycle.trim().length > 0
  );
}

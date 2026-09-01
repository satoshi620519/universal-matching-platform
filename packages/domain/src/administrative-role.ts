export type AdministrativeRoleKey =
  | 'moderator'
  | 'administrator'
  | 'auditor';

const administrativeRoleKeys: readonly AdministrativeRoleKey[] = [
  'moderator',
  'administrator',
  'auditor',
];

export function isAdministrativeRoleKey(
  value: string,
): value is AdministrativeRoleKey {
  return administrativeRoleKeys.includes(value as AdministrativeRoleKey);
}

export interface AdministrativeRoleAssignment {
  readonly accountId: string;
  readonly role: AdministrativeRoleKey;
  readonly effectiveAt: string;
  readonly expiresAt?: string;
  readonly revokedAt?: string;
}

export function isAdministrativeRoleAssignmentActive(
  assignment: AdministrativeRoleAssignment,
  now: Date,
): boolean {
  const effectiveAt = Date.parse(assignment.effectiveAt);
  if (!Number.isFinite(effectiveAt) || effectiveAt > now.getTime()) return false;

  if (assignment.expiresAt) {
    const expiresAt = Date.parse(assignment.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= now.getTime()) return false;
  }

  if (assignment.revokedAt) return false;
  return true;
}

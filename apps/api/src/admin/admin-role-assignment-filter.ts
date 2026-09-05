export interface RoleAssignmentWindow {
  readonly role: string;
  readonly effectiveAt: Date;
  readonly expiresAt?: Date | null;
  readonly revokedAt?: Date | null;
}

export function filterActiveRoleAssignments(assignments: readonly RoleAssignmentWindow[], now: Date): readonly { role: string }[] {
  return assignments.filter((assignment) => assignment.effectiveAt <= now && !assignment.revokedAt && (!assignment.expiresAt || assignment.expiresAt > now)).map(({ role }) => ({ role }));
}

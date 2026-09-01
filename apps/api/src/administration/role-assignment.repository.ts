import type { AdministrativeRoleAssignment, AdministrativeRoleKey } from '@universal/domain';

export interface AssignAdministrativeRoleInput {
  readonly accountId: string;
  readonly role: AdministrativeRoleKey;
  readonly effectiveAt: Date;
  readonly expiresAt?: Date;
  readonly assignedByAccountId?: string;
}

export abstract class RoleAssignmentRepository {
  abstract findActiveForAccount(accountId: string, now: Date): Promise<readonly AdministrativeRoleAssignment[]>;
  abstract assign(input: AssignAdministrativeRoleInput): Promise<void>;
  abstract revokeActive(accountId: string, role: AdministrativeRoleKey, revokedAt: Date): Promise<number>;
}

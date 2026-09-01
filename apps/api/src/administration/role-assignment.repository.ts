import type { AdministrativeRoleAssignment } from '@universal/domain';

export abstract class RoleAssignmentRepository {
  abstract findActiveForAccount(
    accountId: string,
    now: Date,
  ): Promise<readonly AdministrativeRoleAssignment[]>;
}

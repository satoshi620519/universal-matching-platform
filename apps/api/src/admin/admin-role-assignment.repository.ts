export interface ActiveAdminRoleAssignment {
  readonly role: string;
}

export abstract class AdminRoleAssignmentRepository {
  abstract listActiveForAccount(accountId: string, now: Date): Promise<readonly ActiveAdminRoleAssignment[]>;
}

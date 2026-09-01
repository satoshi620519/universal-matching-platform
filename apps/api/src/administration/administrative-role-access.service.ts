import { Injectable } from '@nestjs/common';
import type { AdministrativeRoleKey } from '@universal/domain';

import { RoleAssignmentRepository } from './role-assignment.repository.js';

@Injectable()
export class AdministrativeRoleAccessService {
  constructor(private readonly assignments: RoleAssignmentRepository) {}

  async hasRole(
    accountId: string,
    role: AdministrativeRoleKey,
    now = new Date(),
  ): Promise<boolean> {
    const assignments = await this.assignments.findActiveForAccount(accountId, now);
    return assignments.some((assignment) => assignment.role === role);
  }

  async hasAnyRole(
    accountId: string,
    roles: readonly AdministrativeRoleKey[],
    now = new Date(),
  ): Promise<boolean> {
    const assignments = await this.assignments.findActiveForAccount(accountId, now);
    return assignments.some((assignment) => roles.includes(assignment.role));
  }
}

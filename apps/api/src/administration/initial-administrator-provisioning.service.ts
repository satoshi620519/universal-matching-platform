import { Injectable } from '@nestjs/common';

import { RoleAssignmentRepository } from './role-assignment.repository.js';

@Injectable()
export class InitialAdministratorProvisioningService {
  constructor(private readonly assignments: RoleAssignmentRepository) {}

  async provision(accountId: string, now = new Date()): Promise<boolean> {
    const active = await this.assignments.findActiveForAccount(accountId, now);
    if (active.some((assignment) => assignment.role === 'administrator')) return false;

    await this.assignments.assign({
      accountId,
      role: 'administrator',
      effectiveAt: now,
    });
    return true;
  }
}

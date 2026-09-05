import { Injectable } from '@nestjs/common';
import { RoleAssignmentRepository } from '../administration/role-assignment.repository.js';
import { hasAdminCapability } from './admin-capability-evaluator.js';
import type { AdminCapability } from './admin-capability.js';

@Injectable()
export class AdminCapabilityAccessService {
  constructor(private readonly assignments: RoleAssignmentRepository) {}

  async hasCapability(accountId: string, capability: AdminCapability, now = new Date()): Promise<boolean> {
    const active = await this.assignments.findActiveForAccount(accountId, now);
    return hasAdminCapability(active.map(({ role }) => ({ role })), capability);
  }
}

import { Injectable } from '@nestjs/common';
import type { AdministrativeRoleKey } from '@universal/domain';
import { AuditRecordService } from './audit-record.service.js';
import { RoleAssignmentRepository } from './role-assignment.repository.js';

@Injectable()
export class RoleAssignmentMutationService {
  constructor(private readonly assignments: RoleAssignmentRepository, private readonly audit: AuditRecordService) {}

  async assign(input: { readonly actorId: string; readonly accountId: string; readonly role: AdministrativeRoleKey; readonly effectiveAt?: Date; readonly expiresAt?: Date }): Promise<void> {
    const effectiveAt = input.effectiveAt ?? new Date();
    if (input.expiresAt && input.expiresAt <= effectiveAt) throw new Error('expiresAt must be after effectiveAt');
    await this.assignments.assign({ accountId: input.accountId, role: input.role, effectiveAt, ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}), assignedByAccountId: input.actorId });
    await this.audit.append({ actorId: input.actorId, area: 'security', action: 'assign-administrative-role', targetId: input.accountId, occurredAt: effectiveAt.toISOString() });
  }

  async revoke(input: { readonly actorId: string; readonly accountId: string; readonly role: AdministrativeRoleKey; readonly revokedAt?: Date }): Promise<boolean> {
    const revokedAt = input.revokedAt ?? new Date();
    if (await this.assignments.revokeActive(input.accountId, input.role, revokedAt) === 0) return false;
    await this.audit.append({ actorId: input.actorId, area: 'security', action: 'revoke-administrative-role', targetId: input.accountId, occurredAt: revokedAt.toISOString() });
    return true;
  }
}

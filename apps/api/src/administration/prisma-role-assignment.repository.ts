import { Injectable } from '@nestjs/common';
import type { AdministrativeRoleAssignment, AdministrativeRoleKey } from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';
import { RoleAssignmentRepository, type AssignAdministrativeRoleInput } from './role-assignment.repository.js';

@Injectable()
export class PrismaRoleAssignmentRepository extends RoleAssignmentRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async findActiveForAccount(accountId: string, now: Date): Promise<readonly AdministrativeRoleAssignment[]> {
    const rows = await this.database.roleAssignment.findMany({
      where: { accountId, effectiveAt: { lte: now }, revokedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
      include: { role: { select: { key: true } } }, orderBy: [{ effectiveAt: 'desc' }, { id: 'desc' }],
    });
    return rows.map((row) => ({ accountId: row.accountId, role: row.role.key as AdministrativeRoleAssignment['role'], effectiveAt: row.effectiveAt.toISOString(), ...(row.expiresAt ? { expiresAt: row.expiresAt.toISOString() } : {}) }));
  }

  async assign(input: AssignAdministrativeRoleInput): Promise<void> {
    const role = await this.database.role.upsert({ where: { key: input.role }, create: { key: input.role }, update: {}, select: { id: true } });
    await this.database.roleAssignment.create({ data: { accountId: input.accountId, roleId: role.id, effectiveAt: input.effectiveAt, expiresAt: input.expiresAt, assignedByAccountId: input.assignedByAccountId } });
  }

  async revokeActive(accountId: string, role: AdministrativeRoleKey, revokedAt: Date): Promise<number> {
    const result = await this.database.roleAssignment.updateMany({
      where: { accountId, role: { key: role }, effectiveAt: { lte: revokedAt }, revokedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: revokedAt } }] },
      data: { revokedAt },
    });
    return result.count;
  }
}

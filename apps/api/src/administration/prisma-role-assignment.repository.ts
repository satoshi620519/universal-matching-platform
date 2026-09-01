import { Injectable } from '@nestjs/common';
import type { AdministrativeRoleAssignment } from '@universal/domain';

import { DatabaseService } from '../database/database.service.js';
import { RoleAssignmentRepository } from './role-assignment.repository.js';

@Injectable()
export class PrismaRoleAssignmentRepository extends RoleAssignmentRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async findActiveForAccount(
    accountId: string,
    now: Date,
  ): Promise<readonly AdministrativeRoleAssignment[]> {
    const rows = await this.database.roleAssignment.findMany({
      where: {
        accountId,
        effectiveAt: { lte: now },
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      include: { role: { select: { key: true } },
      },
      orderBy: [{ effectiveAt: 'desc' }, { id: 'desc' }],
    });

    return rows.map((row) => ({
      accountId: row.accountId,
      role: row.role.key as AdministrativeRoleAssignment['role'],
      effectiveAt: row.effectiveAt.toISOString(),
      ...(row.expiresAt ? { expiresAt: row.expiresAt.toISOString() } : {}),
    }));
  }
}

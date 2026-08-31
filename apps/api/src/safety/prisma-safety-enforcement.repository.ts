import { Injectable } from '@nestjs/common';
import {
  isSafetyEnforcementActive,
  type SafetyEnforcement,
} from '@universal/domain';

import { DatabaseService } from '../database/database.service.js';
import { SafetyEnforcementRepository } from './safety-enforcement.repository.js';

@Injectable()
export class PrismaSafetyEnforcementRepository extends SafetyEnforcementRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async findActiveForAccount(
    accountId: string,
    now: Date,
  ): Promise<readonly SafetyEnforcement[]> {
    const records = await this.database.safetyEnforcement.findMany({
      where: {
        accountId,
        status: 'active',
        effectiveAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { effectiveAt: 'desc' },
    });

    return records
      .map((record) => ({
        ...record,
        effectiveAt: record.effectiveAt.toISOString(),
        expiresAt: record.expiresAt?.toISOString(),
        revokedAt: record.revokedAt?.toISOString(),
      }))
      .filter((record) =>
        isSafetyEnforcementActive(record, now.toISOString()),
      );
  }
}

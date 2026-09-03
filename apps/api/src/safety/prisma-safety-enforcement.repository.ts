import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { isSafetyEnforcementActive, type SafetyEnforcement, type SafetyRestriction } from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';
import { SafetyEnforcementRepository, type CreateSafetyEnforcementInput } from './safety-enforcement.repository.js';

@Injectable()
export class PrismaSafetyEnforcementRepository extends SafetyEnforcementRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async findActiveForAccount(accountId: string, now: Date): Promise<readonly SafetyEnforcement[]> {
    const records = await this.database.safetyEnforcement.findMany({ where: { accountId, status: 'active', effectiveAt: { lte: now }, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }, orderBy: { effectiveAt: 'desc' } });
    return records.map(record => ({ ...record, restriction: record.restriction as SafetyRestriction, status: record.status as SafetyEnforcement['status'], effectiveAt: record.effectiveAt.toISOString(), expiresAt: record.expiresAt?.toISOString(), revokedAt: record.revokedAt?.toISOString() })).filter(record => isSafetyEnforcementActive(record, now.toISOString()));
  }

  async create(input: CreateSafetyEnforcementInput): Promise<SafetyEnforcement> {
    const record = await this.database.safetyEnforcement.create({ data: { id: randomUUID(), accountId: input.accountId, restriction: input.restriction, reasonCategory: input.reasonCategory, status: 'active', effectiveAt: input.effectiveAt, expiresAt: input.expiresAt } });
    return { id: record.id, accountId: record.accountId, restriction: record.restriction as SafetyRestriction, reasonCategory: record.reasonCategory, status: record.status as SafetyEnforcement['status'], effectiveAt: record.effectiveAt.toISOString(), expiresAt: record.expiresAt?.toISOString(), revokedAt: record.revokedAt?.toISOString() };
  }
}

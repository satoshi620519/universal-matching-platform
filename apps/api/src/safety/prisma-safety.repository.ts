import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateSafetyReportInput } from './safety.types.js';

export type CreateEnforcementInput = {
  accountId: string;
  restriction: 'warning' | 'suspension' | 'ban';
  reasonCategory: string;
  expiresAt?: Date;
  actorId: string;
};

@Injectable()
export class PrismaSafetyRepository {
  constructor(private readonly database: DatabaseService) {}

  async createReport(input: CreateSafetyReportInput) {
    return this.database.$transaction(async (tx) => {
      const report = await tx.safetyReport.create({ data: { ...input, status: 'open' } });
      const moderationCase = await tx.moderationCase.create({ data: { reportId: report.id, status: 'queued' } });
      return { report, moderationCase };
    });
  }

  async createEnforcement(input: CreateEnforcementInput) {
    return this.database.$transaction(async (tx) => {
      const enforcement = await tx.safetyEnforcement.create({
        data: {
          accountId: input.accountId,
          restriction: input.restriction,
          reasonCategory: input.reasonCategory,
          status: 'active',
          effectiveAt: new Date(),
          expiresAt: input.expiresAt,
        },
      });
      await tx.auditRecord.create({
        data: {
          actorId: input.actorId,
          area: 'safety',
          action: 'enforcement.created',
          targetId: enforcement.id,
          occurredAt: new Date(),
        },
      });
      return enforcement;
    });
  }
}

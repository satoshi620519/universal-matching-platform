import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateSafetyReportInput } from './safety.types.js';

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
}

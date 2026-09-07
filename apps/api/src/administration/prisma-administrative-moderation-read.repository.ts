import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { AdministrativeModerationReadRepository, type AdministrativeModerationPage, type AdministrativeModerationReportSummary, type AdministrativeModerationCaseSummary } from './administrative-moderation-read.repository.js';

@Injectable()
export class PrismaAdministrativeModerationReadRepository extends AdministrativeModerationReadRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async listReports(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeModerationPage<AdministrativeModerationReportSummary>> {
    const records = await this.database.safetyReport.findMany({
      take: input.limit + 1,
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      orderBy: { id: 'asc' },
      select: { id: true, targetId: true, targetType: true, status: true, createdAt: true },
    });
    const items = records.slice(0, input.limit);
    return { items, nextCursor: records.length > input.limit ? items.at(-1)?.id ?? null : null };
  }

  async listCases(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeModerationPage<AdministrativeModerationCaseSummary>> {
    const records = await this.database.moderationCase.findMany({
      take: input.limit + 1,
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      orderBy: { id: 'asc' },
      select: { id: true, reportId: true, status: true, createdAt: true, report: { select: { targetId: true } } },
    });
    const items = records.slice(0, input.limit).map(({ report, ...record }) => ({ ...record, targetId: report.targetId }));
    return { items, nextCursor: records.length > input.limit ? items.at(-1)?.id ?? null : null };
  }
}

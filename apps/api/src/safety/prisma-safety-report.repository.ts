import { Injectable, NotFoundException } from '@nestjs/common';
import { canTransitionModerationCase, canTransitionReportStatus, type ModerationCase, type SafetyReport } from '@universal/domain';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service.js';
import { SafetyReportRepository, type CreateSafetyReportInput } from './safety-report.repository.js';

@Injectable()
export class PrismaSafetyReportRepository extends SafetyReportRepository {
  constructor(private readonly database: DatabaseService) { super(); }
  async create(input: CreateSafetyReportInput): Promise<SafetyReport> {
    const record = await this.database.safetyReport.create({ data: { id: randomUUID(), reporterId: input.reporterId, targetId: input.targetId, targetType: input.targetType, reason: input.reason, status: 'submitted' } });
    return this.toReport(record);
  }
  async listForReporter(reporterId: string, limit = 50): Promise<readonly SafetyReport[]> {
    const records = await this.database.safetyReport.findMany({ where: { reporterId }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: Math.min(100, Math.max(1, limit)) });
    return records.map(record => this.toReport(record));
  }
  async findById(id: string): Promise<SafetyReport | null> {
    const record = await this.database.safetyReport.findUnique({ where: { id } });
    return record ? this.toReport(record) : null;
  }
  async transitionReport(id: string, status: SafetyReport['status']): Promise<SafetyReport> {
    const current = await this.database.safetyReport.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('report not found');
    if (!canTransitionReportStatus(current.status as SafetyReport['status'], status)) throw new Error('invalid report status transition');
    return this.toReport(await this.database.safetyReport.update({ where: { id }, data: { status } }));
  }
  async createCase(reportId: string): Promise<ModerationCase> {
    return this.toCase(await this.database.moderationCase.create({ data: { id: randomUUID(), reportId, status: 'open' } }));
  }
  async findCaseByReportId(reportId: string): Promise<ModerationCase | null> {
    const record = await this.database.moderationCase.findUnique({ where: { reportId } });
    return record ? this.toCase(record) : null;
  }
  async transitionCase(id: string, status: ModerationCase['status']): Promise<ModerationCase> {
    const current = await this.database.moderationCase.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('moderation case not found');
    if (!canTransitionModerationCase(current.status as ModerationCase['status'], status)) throw new Error('invalid moderation case transition');
    return this.toCase(await this.database.moderationCase.update({ where: { id }, data: { status } }));
  }
  private toReport(record: { id: string; reporterId: string; targetId: string; targetType: string; reason: string; status: string }): SafetyReport { return { id: record.id, reporterId: record.reporterId, targetId: record.targetId, targetType: record.targetType as SafetyReport['targetType'], reason: record.reason, status: record.status as SafetyReport['status'] }; }
  private toCase(record: { id: string; reportId: string; status: string }): ModerationCase { return { id: record.id, reportId: record.reportId, status: record.status as ModerationCase['status'] }; }
}

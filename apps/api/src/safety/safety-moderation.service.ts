import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { assertValidSafetyReportInput, canTransitionModerationCase, canTransitionReportStatus, restrictionForModerationAction, type ModerationActionType, type ModerationCaseStatus, type ReportStatus, type ReportTargetType } from '@universal/domain';
import { AuditRecordService } from '../administration/audit-record.service.js';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';
import { SafetyEnforcementRepository } from './safety-enforcement.repository.js';
import { SafetyReportRepository } from './safety-report.repository.js';

@Injectable()
export class SafetyModerationService {
  constructor(private readonly reports: SafetyReportRepository, private readonly enforcement: SafetyEnforcementRepository, private readonly admin: AdministrativeCapabilityAccessService, private readonly audit: AuditRecordService) {}
  async submitReport(input: { reporterId: string; targetId: string; targetType: ReportTargetType; reason: string }) {
    try { assertValidSafetyReportInput(input); } catch (error) { throw new BadRequestException(error instanceof Error ? error.message : 'invalid report'); }
    return this.reports.create({ ...input, reason: input.reason.trim() });
  }
  async listMyReports(accountId: string, limit?: number) { return this.reports.listForReporter(accountId, limit); }
  async transitionReport(input: { actorId: string; reportId: string; status: ReportStatus; correlationId?: string }) {
    await this.admin.require(input.actorId, 'manage-moderation');
    const report = await this.reports.findById(input.reportId);
    if (!report) throw new NotFoundException('report not found');
    if (!canTransitionReportStatus(report.status, input.status)) throw new BadRequestException('invalid report status transition');
    const updated = await this.reports.transitionReport(report.id, input.status);
    await this.audit.append({ actorId: input.actorId, area: 'moderation', action: `report.${input.status}`, targetId: report.id, ...(input.correlationId ? { correlationId: input.correlationId } : {}), occurredAt: new Date().toISOString() });
    return updated;
  }
  async openCase(input: { actorId: string; reportId: string; correlationId?: string }) {
    await this.admin.require(input.actorId, 'manage-moderation');
    const report = await this.reports.findById(input.reportId);
    if (!report) throw new NotFoundException('report not found');
    if (report.status === 'dismissed' || report.status === 'actioned') throw new BadRequestException('cannot open a case for a terminal report');
    const existing = await this.reports.findCaseByReportId(report.id);
    if (existing) return existing;
    const created = await this.reports.createCase(report.id);
    await this.audit.append({ actorId: input.actorId, area: 'moderation', action: 'case.open', targetId: created.id, ...(input.correlationId ? { correlationId: input.correlationId } : {}), occurredAt: new Date().toISOString() });
    return created;
  }
  async transitionCase(input: { actorId: string; caseId: string; status: ModerationCaseStatus; correlationId?: string }) {
    await this.admin.require(input.actorId, 'manage-moderation');
    const current = await this.reports.findCaseById(input.caseId);
    if (!current) throw new NotFoundException('moderation case not found');
    if (!canTransitionModerationCase(current.status, input.status)) throw new BadRequestException('invalid moderation case transition');
    const updated = await this.reports.transitionCase(current.id, input.status);
    await this.audit.append({ actorId: input.actorId, area: 'moderation', action: `case.${input.status}`, targetId: updated.id, ...(input.correlationId ? { correlationId: input.correlationId } : {}), occurredAt: new Date().toISOString() });
    return updated;
  }
  async applyAction(input: { actorId: string; caseId: string; targetId: string; action: ModerationActionType; reasonCategory: string; expiresAt?: Date; correlationId?: string }) {
    await this.admin.require(input.actorId, 'manage-moderation');
    const caseRecord = await this.reports.findCaseById(input.caseId);
    if (!caseRecord) throw new NotFoundException('moderation case not found');
    if (caseRecord.status !== 'under-review') throw new BadRequestException('cannot apply action unless moderation case is under review');
    if (!input.reasonCategory.trim()) throw new BadRequestException('reasonCategory is required');
    const restriction = restrictionForModerationAction(input.action);
    if (restriction !== 'none') await this.enforcement.create({ accountId: input.targetId, restriction, reasonCategory: input.reasonCategory.trim(), effectiveAt: new Date(), ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}) });
    if (caseRecord.status === 'under-review') await this.reports.transitionCase(caseRecord.id, 'actioned');
    await this.audit.append({ actorId: input.actorId, area: 'moderation', action: `action.${input.action}`, targetId: input.targetId, ...(input.correlationId ? { correlationId: input.correlationId } : {}), occurredAt: new Date().toISOString() });
    return { caseId: input.caseId, targetId: input.targetId, action: input.action, restriction };
  }
}

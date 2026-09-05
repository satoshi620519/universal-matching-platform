import { Injectable } from '@nestjs/common';
import type { ReportEvidence } from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';
import { ReportEvidenceRepository } from './report-evidence.repository.js';

@Injectable()
export class PrismaReportEvidenceRepository extends ReportEvidenceRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async create(evidence: ReportEvidence): Promise<ReportEvidence> {
    const record = await this.database.reportEvidence.create({ data: { id: evidence.id, reportId: evidence.reportId, kind: evidence.kind, context: evidence.context, reference: evidence.reference, capturedAt: new Date(evidence.capturedAt) } });
    return this.toEvidence(record);
  }

  async listForReport(reportId: string): Promise<readonly ReportEvidence[]> {
    const records = await this.database.reportEvidence.findMany({ where: { reportId }, orderBy: [{ capturedAt: 'asc' }, { id: 'asc' }] });
    return records.map(record => this.toEvidence(record));
  }

  private toEvidence(record: { id: string; reportId: string; kind: string; context: string; reference: string | null; capturedAt: Date }): ReportEvidence {
    return { id: record.id, reportId: record.reportId, kind: record.kind as ReportEvidence['kind'], context: record.context, reference: record.reference, capturedAt: record.capturedAt.toISOString() };
  }
}

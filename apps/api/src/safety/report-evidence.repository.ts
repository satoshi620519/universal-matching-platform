import type { ReportEvidence } from '@universal/domain';

export abstract class ReportEvidenceRepository {
  abstract create(evidence: ReportEvidence): Promise<ReportEvidence>;
  abstract listForReport(reportId: string): Promise<readonly ReportEvidence[]>;
}

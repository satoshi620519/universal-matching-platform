import type { ModerationCase, SafetyReport } from '@universal/domain';

export interface CreateSafetyReportInput {
  readonly reporterId: string;
  readonly targetId: string;
  readonly targetType: SafetyReport['targetType'];
  readonly reason: string;
}

export abstract class SafetyReportRepository {
  abstract create(input: CreateSafetyReportInput): Promise<SafetyReport>;
  abstract listForReporter(reporterId: string, limit?: number): Promise<readonly SafetyReport[]>;
  abstract findById(id: string): Promise<SafetyReport | null>;
  abstract createCase(reportId: string): Promise<ModerationCase>;
  abstract findCaseByReportId(reportId: string): Promise<ModerationCase | null>;
  abstract transitionCase(id: string, status: ModerationCase['status']): Promise<ModerationCase>;
}

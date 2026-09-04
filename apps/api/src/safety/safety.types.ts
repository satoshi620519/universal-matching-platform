export type ReportTargetType = 'account' | 'profile' | 'message' | 'content';

export type CreateReportInput = {
  reporterAccountId: string;
  targetType: ReportTargetType;
  targetId: string;
  category: string;
  context?: Record<string, unknown>;
  evidence?: Record<string, unknown>;
};

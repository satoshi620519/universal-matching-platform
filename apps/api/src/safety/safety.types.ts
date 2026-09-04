export type SafetyReportTargetType = 'account' | 'profile' | 'message' | 'content';
export type SafetyReportStatus = 'open' | 'resolved' | 'dismissed';
export type ModerationCaseStatus = 'queued' | 'in_review' | 'closed';
export type SafetyRestriction = 'warning' | 'suspension' | 'ban';

export type CreateSafetyReportInput = {
  reporterId: string;
  targetId: string;
  targetType: SafetyReportTargetType;
  reason: string;
};

export type ReportTargetType = 'user' | 'content' | 'message';
export type ReportStatus = 'submitted' | 'triaged' | 'closed';

export interface SafetyReport {
  readonly id: string;
  readonly reporterId: string;
  readonly targetId: string;
  readonly targetType: ReportTargetType;
  readonly reason: string;
  readonly status: ReportStatus;
}

const transitions: Record<ReportStatus, readonly ReportStatus[]> = {
  submitted: ['triaged', 'closed'],
  triaged: ['closed'],
  closed: [],
};

export function canTransitionReportStatus(
  from: ReportStatus,
  to: ReportStatus,
): boolean {
  return transitions[from].includes(to);
}

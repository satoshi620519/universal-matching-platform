export type ReportTargetType = 'user' | 'content' | 'message';
export type ReportStatus = 'submitted' | 'triaged' | 'actioned' | 'dismissed';

export interface SafetyReport {
  readonly id: string;
  readonly reporterId: string;
  readonly targetId: string;
  readonly targetType: ReportTargetType;
  readonly reason: string;
  readonly status: ReportStatus;
}

export function assertValidSafetyReportInput(input: Pick<SafetyReport, 'reporterId' | 'targetId' | 'targetType' | 'reason'>): void {
  if (!input.reporterId.trim() || !input.targetId.trim()) throw new Error('reporter and target are required');
  if (input.targetType === 'user' && input.reporterId.trim() === input.targetId.trim()) throw new Error('cannot report yourself');
  if (!input.reason.trim()) throw new Error('report reason is required');
}

const transitions: Record<ReportStatus, readonly ReportStatus[]> = {
  submitted: ['triaged', 'dismissed'],
  triaged: ['actioned', 'dismissed'],
  actioned: [],
  dismissed: [],
};

export function canTransitionReportStatus(from: ReportStatus, to: ReportStatus): boolean {
  return transitions[from].includes(to);
}

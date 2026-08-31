export type ModerationCaseStatus =
  | 'open'
  | 'under-review'
  | 'actioned'
  | 'closed';

export interface ModerationCase {
  readonly id: string;
  readonly reportId: string;
  readonly status: ModerationCaseStatus;
}

const transitions: Record<ModerationCaseStatus, readonly ModerationCaseStatus[]> = {
  open: ['under-review', 'closed'],
  'under-review': ['actioned', 'closed'],
  actioned: ['closed'],
  closed: [],
};

export function canTransitionModerationCase(
  from: ModerationCaseStatus,
  to: ModerationCaseStatus,
): boolean {
  return transitions[from].includes(to);
}

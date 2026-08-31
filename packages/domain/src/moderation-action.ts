import type { SafetyRestriction } from './safety-restriction.js';

export type ModerationActionType =
  | 'warning'
  | 'restrict-features'
  | 'restrict-communication'
  | 'suspend'
  | 'close-without-action';

export interface ModerationAction {
  readonly type: ModerationActionType;
  readonly caseId: string;
  readonly targetId: string;
}

export function restrictionForModerationAction(
  action: ModerationActionType,
): SafetyRestriction {
  switch (action) {
    case 'restrict-features':
      return 'feature-restricted';
    case 'restrict-communication':
      return 'communication-restricted';
    case 'suspend':
      return 'suspended';
    case 'warning':
    case 'close-without-action':
      return 'none';
  }
}

export function isEnforcementAction(action: ModerationActionType): boolean {
  return restrictionForModerationAction(action) !== 'none';
}

import { describe, expect, it } from 'vitest';
import {
  isEnforcementAction,
  restrictionForModerationAction,
} from './moderation-action.js';

describe('moderation action policy', () => {
  it('maps configurable enforcement actions to existing safety restrictions', () => {
    expect(restrictionForModerationAction('restrict-features')).toBe('feature-restricted');
    expect(restrictionForModerationAction('restrict-communication')).toBe(
      'communication-restricted',
    );
    expect(restrictionForModerationAction('suspend')).toBe('suspended');
  });

  it('does not create a restriction for warnings or no-action closure', () => {
    expect(restrictionForModerationAction('warning')).toBe('none');
    expect(restrictionForModerationAction('close-without-action')).toBe('none');
  });

  it('identifies enforcement actions without duplicating restriction rules', () => {
    expect(isEnforcementAction('suspend')).toBe(true);
    expect(isEnforcementAction('warning')).toBe(false);
  });
});

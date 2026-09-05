import { describe, expect, it } from 'vitest';
import { isEnforcementAction, restrictionForModerationAction } from './moderation-action.js';

describe('moderation actions', () => {
  it('maps every canonical action to its restriction boundary', () => {
    expect(restrictionForModerationAction('warning')).toBe('none');
    expect(restrictionForModerationAction('restrict-features')).toBe('feature-restricted');
    expect(restrictionForModerationAction('restrict-communication')).toBe('communication-restricted');
    expect(restrictionForModerationAction('suspend')).toBe('suspended');
    expect(restrictionForModerationAction('close-without-action')).toBe('none');
  });

  it('distinguishes enforcement actions from non-enforcement outcomes', () => {
    expect(isEnforcementAction('warning')).toBe(false);
    expect(isEnforcementAction('close-without-action')).toBe(false);
    expect(isEnforcementAction('suspend')).toBe(true);
  });
});

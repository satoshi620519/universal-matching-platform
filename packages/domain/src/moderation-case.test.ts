import { describe, expect, it } from 'vitest';
import { canTransitionModerationCase } from './moderation-case.js';

describe('moderation case lifecycle', () => {
  it('allows an open case to enter review or close', () => {
    expect(canTransitionModerationCase('open', 'under-review')).toBe(true);
    expect(canTransitionModerationCase('open', 'closed')).toBe(true);
  });

  it('allows a reviewed case to be actioned or closed', () => {
    expect(canTransitionModerationCase('under-review', 'actioned')).toBe(true);
    expect(canTransitionModerationCase('under-review', 'closed')).toBe(true);
  });

  it('requires actioned cases to close before becoming terminal', () => {
    expect(canTransitionModerationCase('actioned', 'closed')).toBe(true);
    expect(canTransitionModerationCase('actioned', 'under-review')).toBe(false);
  });

  it('rejects transitions from closed cases', () => {
    expect(canTransitionModerationCase('closed', 'open')).toBe(false);
  });
});

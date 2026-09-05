import { describe, expect, it } from 'vitest';
import { assertValidSafetyReportInput, canTransitionReportStatus } from './report.js';

describe('safety report domain', () => {
  const base = { reporterId: 'reporter', targetId: 'target', targetType: 'user' as const, reason: 'abuse' };

  it('accepts a valid report', () => expect(() => assertValidSafetyReportInput(base)).not.toThrow());

  it('rejects self-report and blank required fields', () => {
    expect(() => assertValidSafetyReportInput({ ...base, targetId: 'reporter' })).toThrow('cannot report yourself');
    expect(() => assertValidSafetyReportInput({ ...base, reporterId: ' ' })).toThrow();
    expect(() => assertValidSafetyReportInput({ ...base, reason: ' ' })).toThrow();
  });

  it('allows only canonical lifecycle transitions', () => {
    expect(canTransitionReportStatus('submitted', 'triaged')).toBe(true);
    expect(canTransitionReportStatus('submitted', 'dismissed')).toBe(true);
    expect(canTransitionReportStatus('triaged', 'actioned')).toBe(true);
    expect(canTransitionReportStatus('triaged', 'dismissed')).toBe(true);
    expect(canTransitionReportStatus('submitted', 'actioned')).toBe(false);
    expect(canTransitionReportStatus('dismissed', 'triaged')).toBe(false);
  });
});

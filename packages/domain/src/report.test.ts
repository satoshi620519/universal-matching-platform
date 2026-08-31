import { describe, expect, it } from 'vitest';
import { canTransitionReportStatus } from './report.js';

describe('safety report lifecycle', () => {
  it('allows submitted reports to be triaged or closed', () => {
    expect(canTransitionReportStatus('submitted', 'triaged')).toBe(true);
    expect(canTransitionReportStatus('submitted', 'closed')).toBe(true);
  });

  it('allows triaged reports to be closed', () => {
    expect(canTransitionReportStatus('triaged', 'closed')).toBe(true);
  });

  it('rejects reopening terminal reports', () => {
    expect(canTransitionReportStatus('closed', 'submitted')).toBe(false);
    expect(canTransitionReportStatus('closed', 'triaged')).toBe(false);
  });
});

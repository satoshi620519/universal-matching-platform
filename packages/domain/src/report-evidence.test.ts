import { describe, expect, it } from 'vitest';
import { createReportEvidence } from './report-evidence.js';

describe('report evidence', () => {
  it('normalizes immutable capture metadata', () => {
    expect(createReportEvidence({ id: ' e1 ', reportId: ' r1 ', kind: 'text-context', context: ' details ', capturedAt: '2026-09-05T00:00:00.000Z' })).toEqual({ id: 'e1', reportId: 'r1', kind: 'text-context', context: 'details', reference: null, capturedAt: '2026-09-05T00:00:00.000Z' });
  });
  it('rejects missing identity or context', () => {
    expect(() => createReportEvidence({ id: '', reportId: 'r', kind: 'text-context', context: 'x' })).toThrow();
    expect(() => createReportEvidence({ id: 'e', reportId: 'r', kind: 'text-context', context: ' ' })).toThrow();
  });
});

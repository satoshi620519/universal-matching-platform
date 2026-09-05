import { describe, expect, it } from 'vitest';
import { createAbuseControlPolicy, evaluateAbuseControl } from './abuse-control.js';

describe('AbuseControlPolicy', () => {
  it('requires a stable key and positive integer limits', () => {
    expect(() => createAbuseControlPolicy({ key: ' ', limit: 1, windowMs: 1 })).toThrow();
    expect(() => createAbuseControlPolicy({ key: 'report', limit: 0, windowMs: 1 })).toThrow();
    expect(() => createAbuseControlPolicy({ key: 'report', limit: 1, windowMs: 0 })).toThrow();
  });

  it('allows until the limit and rejects for the remaining window', () => {
    const policy = createAbuseControlPolicy({ key: 'report', limit: 2, windowMs: 1000 });
    expect(evaluateAbuseControl({ policy, count: 0, windowStartedAt: 0, now: 100 })).toEqual({ allowed: true, remaining: 1, retryAfterMs: 0 });
    expect(evaluateAbuseControl({ policy, count: 1, windowStartedAt: 0, now: 100 })).toEqual({ allowed: true, remaining: 0, retryAfterMs: 0 });
    expect(evaluateAbuseControl({ policy, count: 2, windowStartedAt: 0, now: 100 })).toEqual({ allowed: false, remaining: 0, retryAfterMs: 900 });
  });

  it('resets deterministically when the window expires', () => {
    const policy = createAbuseControlPolicy({ key: 'report', limit: 2, windowMs: 1000 });
    expect(evaluateAbuseControl({ policy, count: 2, windowStartedAt: 0, now: 1000 })).toEqual({ allowed: true, remaining: 1, retryAfterMs: 0 });
  });
});

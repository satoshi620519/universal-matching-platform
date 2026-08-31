import { describe, expect, it, vi } from 'vitest';

import { InMemoryRequestRateLimiter } from './in-memory-request-rate-limiter.js';

describe('InMemoryRequestRateLimiter', () => {
  it('rejects requests after the configured limit inside the window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T00:00:00.000Z'));
    const limiter = new InMemoryRequestRateLimiter();
    const policy = { limit: 2, windowMs: 60_000 };

    expect(limiter.consume('key', policy)).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.consume('key', policy)).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.consume('key', policy)).toMatchObject({ allowed: false, remaining: 0 });

    vi.useRealTimers();
  });

  it('allows requests again after the window expires', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T00:00:00.000Z'));
    const limiter = new InMemoryRequestRateLimiter();
    const policy = { limit: 1, windowMs: 1_000 };

    limiter.consume('key', policy);
    vi.advanceTimersByTime(1_001);

    expect(limiter.consume('key', policy)).toMatchObject({ allowed: true });
    vi.useRealTimers();
  });

  it('keeps independent keys isolated', () => {
    const limiter = new InMemoryRequestRateLimiter();
    const policy = { limit: 1, windowMs: 60_000 };

    limiter.consume('a', policy);

    expect(limiter.consume('b', policy)).toMatchObject({ allowed: true });
  });
});

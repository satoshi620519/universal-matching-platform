import { Injectable } from '@nestjs/common';

import { type RateLimitDecision, type RequestRateLimit, RequestRateLimiter } from './request-rate-limiter.js';

type WindowState = { readonly startedAt: number; count: number };

@Injectable()
export class InMemoryRequestRateLimiter extends RequestRateLimiter {
  private readonly windows = new Map<string, WindowState>();

  consume(key: string, limit: RequestRateLimit): RateLimitDecision {
    if (!Number.isFinite(limit.limit) || !Number.isFinite(limit.windowMs) || limit.limit <= 0 || limit.windowMs <= 0) {
      return { allowed: false, retryAfterMs: 0, remaining: 0 };
    }

    const now = Date.now();
    const current = this.windows.get(key);
    const state = !current || now - current.startedAt >= limit.windowMs
      ? { startedAt: now, count: 0 }
      : current;

    state.count += 1;
    this.windows.set(key, state);

    const allowed = state.count <= limit.limit;
    return {
      allowed,
      remaining: Math.max(0, limit.limit - state.count),
      retryAfterMs: allowed ? 0 : Math.max(0, limit.windowMs - (now - state.startedAt)),
    };
  }
}

import { Injectable } from '@nestjs/common';

import {
  RequestRateLimiter,
  type RateLimitDecision,
  type RequestRateLimit,
} from './request-rate-limiter.js';

interface Bucket {
  readonly timestamps: number[];
}

@Injectable()
export class InMemoryRequestRateLimiter extends RequestRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  consume(key: string, limit: RequestRateLimit): RateLimitDecision {
    const now = Date.now();
    const cutoff = now - limit.windowMs;
    const bucket = this.buckets.get(key) ?? { timestamps: [] };
    const timestamps = bucket.timestamps.filter((timestamp) => timestamp > cutoff);

    if (timestamps.length >= limit.limit) {
      const retryAfterMs = Math.max(0, timestamps[0] + limit.windowMs - now);
      this.buckets.set(key, { timestamps });

      return {
        allowed: false,
        retryAfterMs,
        remaining: 0,
      };
    }

    timestamps.push(now);
    this.buckets.set(key, { timestamps });

    return {
      allowed: true,
      retryAfterMs: 0,
      remaining: Math.max(0, limit.limit - timestamps.length),
    };
  }
}

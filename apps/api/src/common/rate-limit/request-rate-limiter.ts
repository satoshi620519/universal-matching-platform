export interface RequestRateLimit {
  readonly limit: number;
  readonly windowMs: number;
}

export interface RateLimitDecision {
  readonly allowed: boolean;
  readonly retryAfterMs: number;
  readonly remaining: number;
}

export abstract class RequestRateLimiter {
  abstract consume(key: string, limit: RequestRateLimit): RateLimitDecision;
}

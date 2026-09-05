export type AbuseControlKey = string;

export type AbuseControlPolicy = Readonly<{
  key: string;
  limit: number;
  windowMs: number;
}>;

export type AbuseControlDecision = Readonly<{
  allowed: boolean;
  retryAfterMs: number;
  remaining: number;
}>;

export function createAbuseControlPolicy(input: { key: string; limit: number; windowMs: number }): AbuseControlPolicy {
  if (!input.key.trim()) throw new Error('abuse control policy key is required');
  if (!Number.isInteger(input.limit) || input.limit < 1) throw new Error('abuse control limit must be a positive integer');
  if (!Number.isInteger(input.windowMs) || input.windowMs < 1) throw new Error('abuse control windowMs must be a positive integer');
  return Object.freeze({ ...input, key: input.key.trim() });
}

export function evaluateAbuseControl(input: { policy: AbuseControlPolicy; count: number; windowStartedAt: number; now: number }): AbuseControlDecision {
  const elapsed = input.now - input.windowStartedAt;
  if (elapsed >= input.policy.windowMs) return { allowed: true, remaining: input.policy.limit - 1, retryAfterMs: 0 };
  if (input.count >= input.policy.limit) return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, input.policy.windowMs - elapsed) };
  return { allowed: true, remaining: Math.max(0, input.policy.limit - input.count - 1), retryAfterMs: 0 };
}

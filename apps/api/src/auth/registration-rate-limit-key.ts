import { createHash } from 'node:crypto';

export function deriveRegistrationRateLimitKey(
  remoteAddress: string | undefined,
): string {
  const source = remoteAddress?.trim() || 'unknown';
  return `registration:${createHash('sha256').update(source).digest('base64url')}`;
}

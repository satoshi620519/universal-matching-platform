import { createHash, randomBytes } from 'node:crypto';

export interface SessionCredential {
  readonly raw: string;
  readonly hash: string;
}

export function createSessionCredential(): SessionCredential {
  const raw = randomBytes(32).toString('base64url');
  return {
    raw,
    hash: hashSessionCredential(raw),
  };
}

export function hashSessionCredential(value: string): string {
  return createHash('sha256').update(value).digest('base64url');
}

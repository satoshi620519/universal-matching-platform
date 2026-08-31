import { createHash, randomBytes } from 'node:crypto';

export interface EmailVerificationToken {
  readonly raw: string;
  readonly hash: string;
}

export function createEmailVerificationToken(): EmailVerificationToken {
  const raw = randomBytes(32).toString('base64url');
  return {
    raw,
    hash: hashEmailVerificationToken(raw),
  };
}

export function hashEmailVerificationToken(value: string): string {
  return createHash('sha256').update(value).digest('base64url');
}

export type VerificationStatus = 'not-started' | 'pending' | 'verified' | 'failed' | 'expired' | 'revoked';

export interface VerificationRecord {
  readonly level: 0 | 1 | 2 | 3;
  readonly status: VerificationStatus;
  readonly verifiedAt?: string;
  readonly expiresAt?: string;
}

export function isVerificationUsable(record: VerificationRecord, now: string): boolean {
  if (record.status !== 'verified') return false;
  if (record.expiresAt === undefined) return true;

  const expiresAt = new Date(record.expiresAt).getTime();
  const current = new Date(now).getTime();
  return !Number.isNaN(expiresAt) && !Number.isNaN(current) && current < expiresAt;
}

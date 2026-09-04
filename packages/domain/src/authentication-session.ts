export interface AuthenticationSessionRecord {
  readonly id: string;
  readonly accountId: string;
  readonly authenticationIdentityId: string;
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
}

export interface AuthenticationSessionRepository {
  create(record: AuthenticationSessionRecord): Promise<void>;
  findActiveById(id: string, now: Date): Promise<AuthenticationSessionRecord | undefined>;
  listActiveByAccountId(accountId: string, now: Date): Promise<readonly AuthenticationSessionRecord[]>;
  revoke(id: string, revokedAt: Date): Promise<void>;
  revokeAllForAccount(accountId: string, revokedAt: Date): Promise<void>;
}

export function isAuthenticationSessionActive(record: AuthenticationSessionRecord, now: Date): boolean {
  return record.revokedAt === null && record.expiresAt.getTime() > now.getTime();
}

export function assertAuthenticationSessionBoundary(record: AuthenticationSessionRecord): void {
  if (!record.id.trim() || !record.accountId.trim() || !record.authenticationIdentityId.trim()) {
    throw new Error('authentication session identifiers are required');
  }
  if (record.expiresAt.getTime() <= record.issuedAt.getTime()) {
    throw new Error('authentication session expiry must be after issuance');
  }
}

import { PasswordCredentialRepository } from './password-credential.repository.js';
import { PasswordRecoveryRepository, type PasswordRecoveryRecord } from './password-recovery.repository.js';

export interface PasswordHashCreator {
  hash(password: string): Promise<string>;
}

export interface AccountSessionRevoker {
  revokeAllForAccount(accountId: string, revokedAt: Date): Promise<void>;
}

export interface RecoveryIdentityLookup {
  findById(id: string): Promise<{ id: string; accountId: string } | null>;
}

export type PasswordResetCompletionResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: 'invalid_or_expired_recovery' | 'credential_not_found' };

export class PasswordResetCompletionService {
  constructor(
    private readonly recoveries: PasswordRecoveryRepository,
    private readonly identities: RecoveryIdentityLookup,
    private readonly credentials: PasswordCredentialRepository,
    private readonly hasher: PasswordHashCreator,
    private readonly sessions: AccountSessionRevoker,
  ) {}

  async complete(input: {
    recoveryId: string;
    newPassword: string;
    now: Date;
  }): Promise<PasswordResetCompletionResult> {
    const recovery = await this.recoveries.findById(input.recoveryId);
    if (!recovery || !isUsable(recovery, input.now)) {
      return { ok: false, reason: 'invalid_or_expired_recovery' };
    }

    const identity = await this.identities.findById(recovery.authenticationIdentityId);
    if (!identity) return { ok: false, reason: 'invalid_or_expired_recovery' };

    const passwordHash = await this.hasher.hash(input.newPassword);
    const credential = await this.credentials.replacePasswordHash(identity.id, passwordHash);
    if (!credential) return { ok: false, reason: 'credential_not_found' };

    await this.recoveries.consume(recovery.id, input.now);
    await this.sessions.revokeAllForAccount(identity.accountId, input.now);
    return { ok: true };
  }
}

function isUsable(record: PasswordRecoveryRecord, now: Date): boolean {
  return record.status === 'active'
    && record.consumedAt === null
    && record.revokedAt === null
    && record.expiresAt.getTime() > now.getTime();
}

export type PasswordRecoveryStatus = 'active' | 'consumed' | 'expired' | 'revoked';

export interface PasswordRecoveryRecord {
  readonly id: string;
  readonly authenticationIdentityId: string;
  readonly secretHash: string;
  readonly status: PasswordRecoveryStatus;
  readonly requestedAt: Date;
  readonly expiresAt: Date;
  readonly consumedAt: Date | null;
  readonly revokedAt: Date | null;
}

export abstract class PasswordRecoveryRepository {
  abstract findById(id: string): Promise<PasswordRecoveryRecord | null>;
  abstract consume(id: string, consumedAt: Date): Promise<void>;
}

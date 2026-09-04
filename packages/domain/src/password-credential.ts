export type PasswordCredentialStatus = 'active' | 'disabled';

export interface PasswordCredentialRecord {
  readonly authenticationIdentityId: string;
  readonly passwordHash: string;
  readonly status: PasswordCredentialStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PasswordCredentialRepository {
  findByAuthenticationIdentityId(
    authenticationIdentityId: string,
  ): Promise<PasswordCredentialRecord | undefined>;
  save(record: PasswordCredentialRecord): Promise<void>;
  replaceActiveHash(
    authenticationIdentityId: string,
    passwordHash: string,
    updatedAt: Date,
  ): Promise<PasswordCredentialRecord>;
  disable(authenticationIdentityId: string, updatedAt: Date): Promise<void>;
}

export function assertPasswordCredentialBoundary(record: PasswordCredentialRecord): void {
  if (!record.authenticationIdentityId.trim()) {
    throw new Error('password credential authentication identity id is required');
  }
  if (!record.passwordHash.trim()) {
    throw new Error('password credential hash is required');
  }
  if (record.status !== 'active' && record.status !== 'disabled') {
    throw new Error('password credential status is invalid');
  }
}

export function canVerifyPasswordCredential(record: PasswordCredentialRecord): boolean {
  return record.status === 'active';
}

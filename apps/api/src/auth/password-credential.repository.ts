export type PasswordCredentialStatus = 'active' | 'disabled';

export interface PasswordCredentialRecord {
  readonly authenticationIdentityId: string;
  readonly passwordHash: string;
  readonly status: PasswordCredentialStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreatePasswordCredentialRecord {
  readonly authenticationIdentityId: string;
  readonly passwordHash: string;
  readonly status?: PasswordCredentialStatus;
}

export abstract class PasswordCredentialRepository {
  abstract create(
    input: CreatePasswordCredentialRecord,
  ): Promise<PasswordCredentialRecord>;

  abstract findByAuthenticationIdentityId(
    authenticationIdentityId: string,
  ): Promise<PasswordCredentialRecord | null>;

  abstract replacePasswordHash(
    authenticationIdentityId: string,
    passwordHash: string,
  ): Promise<PasswordCredentialRecord | null>;

  abstract updateStatus(
    authenticationIdentityId: string,
    status: PasswordCredentialStatus,
  ): Promise<PasswordCredentialRecord | null>;
}

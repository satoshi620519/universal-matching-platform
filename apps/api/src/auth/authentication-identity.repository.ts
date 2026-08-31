export type AuthenticationIdentityStatus = 'active' | 'inactive';

export interface AuthenticationIdentityRecord {
  readonly id: string;
  readonly accountId: string;
  readonly providerType: string;
  readonly providerSubject: string;
  readonly status: AuthenticationIdentityStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateAuthenticationIdentityRecord {
  readonly id?: string;
  readonly accountId: string;
  readonly providerType: string;
  readonly providerSubject: string;
  readonly status?: AuthenticationIdentityStatus;
}

export abstract class AuthenticationIdentityRepository {
  abstract create(
    input: CreateAuthenticationIdentityRecord,
  ): Promise<AuthenticationIdentityRecord>;

  abstract findByProviderIdentity(
    providerType: string,
    providerSubject: string,
  ): Promise<AuthenticationIdentityRecord | null>;

  abstract updateStatus(
    id: string,
    status: AuthenticationIdentityStatus,
  ): Promise<AuthenticationIdentityRecord | null>;
}

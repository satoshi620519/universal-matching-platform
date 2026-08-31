export interface AuthenticationSession {
  readonly id: string;
  readonly accountId: string;
  readonly authenticationMethod: string;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
  readonly credentialHash: string;
}

export abstract class SessionRepository {
  abstract create(input: {
    readonly accountId: string;
    readonly authenticationMethod: string;
    readonly expiresAt: Date;
    readonly credentialHash: string;
  }): Promise<AuthenticationSession>;

  abstract findByCredentialHash(
    credentialHash: string,
  ): Promise<AuthenticationSession | null>;

  abstract revoke(id: string, revokedAt: Date): Promise<void>;
}

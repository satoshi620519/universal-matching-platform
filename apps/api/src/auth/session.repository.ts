export interface AuthenticationSession {
  readonly id: string;
  readonly accountId: string;
  readonly authenticationMethod: string;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
}

export abstract class SessionRepository {
  abstract create(input: {
    readonly accountId: string;
    readonly authenticationMethod: string;
    readonly expiresAt: Date;
  }): Promise<AuthenticationSession>;

  abstract revoke(id: string, revokedAt: Date): Promise<void>;
}

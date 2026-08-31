export interface AuthenticationSession {
  readonly id: string;
  readonly accountId: string;
  readonly authenticationMethod: string;
  readonly expiresAt: Date;
}

export abstract class SessionRepository {
  abstract create(input: {
    readonly accountId: string;
    readonly authenticationMethod: string;
    readonly expiresAt: Date;
  }): Promise<AuthenticationSession>;
}

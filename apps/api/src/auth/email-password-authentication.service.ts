export interface PasswordHashVerifier {
  verify(password: string, passwordHash: string): Promise<boolean>;
}

export interface PasswordCredentialLookup {
  findByAuthenticationIdentityId(
    authenticationIdentityId: string,
  ): Promise<{
    authenticationIdentityId: string;
    passwordHash: string;
    status: 'active' | 'disabled';
  } | null>;
}

export interface EmailPasswordIdentityLookup {
  findByEmail(
    email: string,
  ): Promise<{
    id: string;
    accountId: string;
    authenticationMethod: string;
  } | null>;
}

export interface PasswordSessionIssuer {
  issue(input: {
    accountId: string;
    authenticationMethod: string;
  }): Promise<unknown>;
}

export type EmailPasswordAuthenticationResult =
  | { readonly ok: true; readonly session: unknown }
  | { readonly ok: false; readonly reason: 'invalid_credentials' | 'credential_disabled' };

export class EmailPasswordAuthenticationService {
  constructor(
    private readonly identities: EmailPasswordIdentityLookup,
    private readonly credentials: PasswordCredentialLookup,
    private readonly verifier: PasswordHashVerifier,
    private readonly sessions: PasswordSessionIssuer,
  ) {}

  async authenticate(input: {
    email: string;
    password: string;
  }): Promise<EmailPasswordAuthenticationResult> {
    const identity = await this.identities.findByEmail(input.email);
    if (!identity) return { ok: false, reason: 'invalid_credentials' };

    const credential = await this.credentials.findByAuthenticationIdentityId(identity.id);
    if (!credential) return { ok: false, reason: 'invalid_credentials' };
    if (credential.status !== 'active') {
      return { ok: false, reason: 'credential_disabled' };
    }

    const valid = await this.verifier.verify(input.password, credential.passwordHash);
    if (!valid) return { ok: false, reason: 'invalid_credentials' };

    return {
      ok: true,
      session: await this.sessions.issue({
        accountId: identity.accountId,
        authenticationMethod: identity.authenticationMethod,
      }),
    };
  }
}

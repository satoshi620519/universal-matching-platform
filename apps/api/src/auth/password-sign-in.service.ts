import { Injectable } from '@nestjs/common';

import { AuthenticationIdentityRepository } from './authentication-identity.repository.js';
import { normalizeEmailProviderSubject } from './email-provider-subject.js';
import { PasswordCredentialRepository } from './password-credential.repository.js';
import { PasswordHasher } from './password-hasher.js';

export interface PasswordSignInInput {
  readonly email: string;
  readonly password: string;
}

export type PasswordSignInResult =
  | { readonly kind: 'authenticated'; readonly accountId: string }
  | { readonly kind: 'rejected' };

@Injectable()
export class PasswordSignInService {
  constructor(
    private readonly identities: AuthenticationIdentityRepository,
    private readonly credentials: PasswordCredentialRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async signIn(input: PasswordSignInInput): Promise<PasswordSignInResult> {
    const providerSubject = normalizeEmailProviderSubject(input.email);
    if (!providerSubject || input.password.length === 0) {
      return { kind: 'rejected' };
    }

    const identity = await this.identities.findByProviderIdentity(
      'email-password',
      providerSubject,
    );

    if (!identity || identity.status !== 'active') {
      return { kind: 'rejected' };
    }

    const credential = await this.credentials.findByAuthenticationIdentityId(
      identity.id,
    );

    if (
      !credential ||
      credential.status !== 'active' ||
      !(await this.passwordHasher.verify(input.password, credential.passwordHash))
    ) {
      return { kind: 'rejected' };
    }

    return { kind: 'authenticated', accountId: identity.accountId };
  }
}

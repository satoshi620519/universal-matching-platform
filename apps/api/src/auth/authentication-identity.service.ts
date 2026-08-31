import { Injectable } from '@nestjs/common';

import {
  AuthenticationIdentityRepository,
  type AuthenticationIdentityRecord,
} from './authentication-identity.repository.js';

export interface CreateAuthenticationIdentityInput {
  readonly accountId: string;
  readonly providerType: string;
  readonly providerSubject: string;
}

@Injectable()
export class AuthenticationIdentityService {
  constructor(
    private readonly identities: AuthenticationIdentityRepository,
  ) {}

  create(
    input: CreateAuthenticationIdentityInput,
  ): Promise<AuthenticationIdentityRecord> {
    return this.identities.create({
      accountId: input.accountId,
      providerType: input.providerType,
      providerSubject: input.providerSubject,
      status: 'active',
    });
  }

  findActiveByProviderIdentity(
    providerType: string,
    providerSubject: string,
  ): Promise<AuthenticationIdentityRecord | null> {
    return this.identities
      .findByProviderIdentity(providerType, providerSubject)
      .then((identity) =>
        identity?.status === 'active' ? identity : null,
      );
  }

  async deactivate(id: string): Promise<AuthenticationIdentityRecord | null> {
    const identity = await this.identities.updateStatus(id, 'inactive');
    return identity;
  }
}

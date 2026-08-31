import { Injectable } from '@nestjs/common';

import { PasswordHasher } from './password-hasher.js';
import {
  PasswordRegistrationRepository,
  type PasswordRegistrationRecord,
} from './password-registration.repository.js';

export interface RegisterPasswordAccountInput {
  readonly providerSubject: string;
  readonly password: string;
}

@Injectable()
export class PasswordRegistrationService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly registrations: PasswordRegistrationRepository,
  ) {}

  async register(
    input: RegisterPasswordAccountInput,
  ): Promise<PasswordRegistrationRecord> {
    const passwordHash = await this.passwordHasher.hash(input.password);

    return this.registrations.create({
      accountStatus: 'pending',
      providerType: 'email-password',
      providerSubject: input.providerSubject,
      passwordHash,
    });
  }
}

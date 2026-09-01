import { Injectable } from '@nestjs/common';

import { EmailOutboxRepository } from './email-outbox.repository.js';
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
    private readonly outbox: EmailOutboxRepository,
  ) {}

  async register(
    input: RegisterPasswordAccountInput,
  ): Promise<PasswordRegistrationRecord> {
    const passwordHash = await this.passwordHasher.hash(input.password);

    const registration = await this.registrations.create({
      accountStatus: 'pending-onboarding',
      providerType: 'email-password',
      providerSubject: input.providerSubject,
      passwordHash,
    });

    await this.outbox.enqueue({
      accountId: registration.account.id,
      emailAddress: input.providerSubject,
      kind: 'email-verification',
    });

    return registration;
  }
}

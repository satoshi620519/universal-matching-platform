import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service.js';
import {
  PasswordRegistrationRepository,
  type CreatePasswordRegistrationInput,
  type PasswordRegistrationRecord,
} from './password-registration.repository.js';

@Injectable()
export class PrismaPasswordRegistrationRepository extends PasswordRegistrationRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async create(
    input: CreatePasswordRegistrationInput,
  ): Promise<PasswordRegistrationRecord> {
    return this.database.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: { status: input.accountStatus },
      });

      const authenticationIdentity = await tx.authenticationIdentity.create({
        data: {
          accountId: account.id,
          providerType: input.providerType,
          providerSubject: input.providerSubject,
          status: 'active',
        },
      });

      await tx.passwordCredential.create({
        data: {
          authenticationIdentityId: authenticationIdentity.id,
          passwordHash: input.passwordHash,
          status: 'active',
        },
      });

      return {
        account,
        authenticationIdentity,
      };
    });
  }
}

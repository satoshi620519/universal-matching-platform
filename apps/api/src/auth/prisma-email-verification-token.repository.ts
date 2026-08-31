import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service.js';
import {
  EmailVerificationTokenRepository,
  type EmailVerificationTokenRecord,
} from './email-verification-token.repository.js';

@Injectable()
export class PrismaEmailVerificationTokenRepository extends EmailVerificationTokenRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async create(input: {
    readonly accountId: string;
    readonly tokenHash: string;
    readonly expiresAt: Date;
  }): Promise<EmailVerificationTokenRecord> {
    return this.database.emailVerificationToken.create({ data: input });
  }

  async consumeIfUsable(
    tokenHash: string,
    consumedAt: Date,
  ): Promise<EmailVerificationTokenRecord | null> {
    const updated = await this.database.emailVerificationToken.updateMany({
      where: {
        tokenHash,
        consumedAt: null,
        expiresAt: { gt: consumedAt },
      },
      data: { consumedAt },
    });

    if (updated.count === 0) {
      return null;
    }

    return this.database.emailVerificationToken.findUnique({
      where: { tokenHash },
    });
  }
}

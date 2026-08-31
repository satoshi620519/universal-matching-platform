import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service.js';
import {
  type CreateVerificationRequestRecord,
  type VerificationOutcomeRecord,
  type VerificationRequestRecord,
  VerificationRepository,
} from './verification.repository.js';

@Injectable()
export class PrismaVerificationRepository extends VerificationRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async createRequest(
    input: CreateVerificationRequestRecord,
  ): Promise<VerificationRequestRecord> {
    const record = await this.database.verificationRequest.create({
      data: {
        accountId: input.accountId,
        requestedLevel: input.requestedLevel,
        workflowReference: input.workflowReference,
        status: input.status,
        expiresAt: input.expiresAt,
      },
    });

    return record;
  }

  async findLatestOutcomeForAccount(
    accountId: string,
  ): Promise<VerificationOutcomeRecord | null> {
    const record = await this.database.verificationOutcome.findFirst({
      where: {
        verificationRequest: { accountId },
      },
      orderBy: [{ decidedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return record;
  }
}

import { Injectable } from '@nestjs/common';
import { isVerificationUsable, type VerificationRecord } from '@universal/domain';

import {
  VerificationRepository,
  type VerificationOutcomeRecord,
  type VerificationRequestRecord,
} from './verification.repository.js';

export interface StartVerificationInput {
  readonly accountId: string;
  readonly requestedLevel: number;
  readonly workflowReference: string;
  readonly expiresAt?: Date;
}

@Injectable()
export class VerificationService {
  constructor(private readonly repository: VerificationRepository) {}

  start(input: StartVerificationInput): Promise<VerificationRequestRecord> {
    return this.repository.createRequest({
      accountId: input.accountId,
      requestedLevel: input.requestedLevel,
      workflowReference: input.workflowReference,
      status: 'pending',
      expiresAt: input.expiresAt,
    });
  }

  async findUsableRecordForAccount(
    accountId: string,
    now: string,
  ): Promise<VerificationRecord | null> {
    const outcome = await this.repository.findLatestOutcomeForAccount(accountId);
    if (outcome === null) return null;

    const record = this.toVerificationRecord(outcome);
    return isVerificationUsable(record, now) ? record : null;
  }

  private toVerificationRecord(
    outcome: VerificationOutcomeRecord,
  ): VerificationRecord {
    return {
      level: outcome.level as VerificationRecord['level'],
      status: outcome.status as VerificationRecord['status'],
      ...(outcome.decidedAt
        ? { verifiedAt: outcome.decidedAt.toISOString() }
        : {}),
      ...(outcome.expiresAt
        ? { expiresAt: outcome.expiresAt.toISOString() }
        : {}),
    };
  }
}

export interface VerificationRequestRecord {
  readonly id: string;
  readonly accountId: string;
  readonly requestedLevel: number;
  readonly workflowReference: string;
  readonly status: string;
  readonly createdAt: Date;
  readonly completedAt: Date | null;
  readonly expiresAt: Date | null;
}

export interface VerificationOutcomeRecord {
  readonly id: string;
  readonly verificationRequestId: string;
  readonly level: number;
  readonly status: string;
  readonly decidedAt: Date | null;
  readonly reasonCategory: string | null;
  readonly expiresAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateVerificationRequestRecord {
  readonly accountId: string;
  readonly requestedLevel: number;
  readonly workflowReference: string;
  readonly status: string;
  readonly expiresAt?: Date;
}

export abstract class VerificationRepository {
  abstract createRequest(
    input: CreateVerificationRequestRecord,
  ): Promise<VerificationRequestRecord>;

  abstract findLatestOutcomeForAccount(
    accountId: string,
  ): Promise<VerificationOutcomeRecord | null>;
}

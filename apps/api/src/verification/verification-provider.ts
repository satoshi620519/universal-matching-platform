import type { VerificationLevel } from '@universal/domain';

export type VerificationProviderOutcomeStatus =
  | 'verified'
  | 'failed'
  | 'expired'
  | 'revoked';

export interface VerificationProviderRequest {
  readonly requestId: string;
  readonly accountId: string;
  readonly level: VerificationLevel;
  readonly workflowReference: string;
}

export interface VerificationProviderOutcome {
  readonly providerReference: string;
  readonly status: VerificationProviderOutcomeStatus;
  readonly level: VerificationLevel;
  readonly reasonCategory?: string;
  readonly expiresAt?: Date;
}

/** Provider-neutral boundary. Concrete identity providers must live behind this interface. */
export abstract class VerificationProvider {
  abstract createVerification(
    input: VerificationProviderRequest,
  ): Promise<{ readonly providerReference: string }>;

  abstract getOutcome(
    providerReference: string,
  ): Promise<VerificationProviderOutcome | null>;
}

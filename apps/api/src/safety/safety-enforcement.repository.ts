import type { SafetyEnforcement, SafetyRestriction } from '@universal/domain';

export interface CreateSafetyEnforcementInput {
  readonly accountId: string;
  readonly restriction: SafetyRestriction;
  readonly reasonCategory: string;
  readonly effectiveAt: Date;
  readonly expiresAt?: Date;
}

export abstract class SafetyEnforcementRepository {
  abstract findActiveForAccount(accountId: string, now: Date): Promise<readonly SafetyEnforcement[]>;
  abstract create(input: CreateSafetyEnforcementInput): Promise<SafetyEnforcement>;
}

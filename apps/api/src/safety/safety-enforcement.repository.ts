import type { SafetyEnforcement } from '@universal/domain';

export abstract class SafetyEnforcementRepository {
  abstract findActiveForAccount(
    accountId: string,
    now: Date,
  ): Promise<readonly SafetyEnforcement[]>;
}

import { Injectable } from '@nestjs/common';
import type { VerificationRecord } from '@universal/domain';

export type VerificationLevelAccessReason =
  | 'sufficient-level'
  | 'insufficient-level'
  | 'not-usable';

export interface VerificationLevelAccessResult {
  readonly allowed: boolean;
  readonly reason: VerificationLevelAccessReason;
  readonly requiredLevel: VerificationRecord['level'];
  readonly actualLevel: VerificationRecord['level'] | null;
}

@Injectable()
export class VerificationLevelAccessService {
  evaluate(
    requiredLevel: VerificationRecord['level'],
    usableRecord: VerificationRecord | null,
  ): VerificationLevelAccessResult {
    if (usableRecord === null) {
      return {
        allowed: false,
        reason: 'not-usable',
        requiredLevel,
        actualLevel: null,
      };
    }

    if (usableRecord.level < requiredLevel) {
      return {
        allowed: false,
        reason: 'insufficient-level',
        requiredLevel,
        actualLevel: usableRecord.level,
      };
    }

    return {
      allowed: true,
      reason: 'sufficient-level',
      requiredLevel,
      actualLevel: usableRecord.level,
    };
  }
}

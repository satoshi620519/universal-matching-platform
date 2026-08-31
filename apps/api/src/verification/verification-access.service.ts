import { Injectable } from '@nestjs/common';
import { isVerificationUsable, VerificationRecord } from '@universal/domain';

export type VerificationAccessReason = 'usable' | 'not-verified' | 'expired';

export interface VerificationAccessResult {
  readonly usable: boolean;
  readonly reason: VerificationAccessReason;
}

@Injectable()
export class VerificationAccessService {
  evaluate(record: VerificationRecord, now: string): VerificationAccessResult {
    if (isVerificationUsable(record, now)) {
      return { usable: true, reason: 'usable' };
    }

    if (record.status === 'verified') {
      return { usable: false, reason: 'expired' };
    }

    return { usable: false, reason: 'not-verified' };
  }
}

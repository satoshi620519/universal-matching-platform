import { Injectable } from '@nestjs/common';
import type { VerificationRecord } from '@universal/domain';

import {
  VerificationLevelAccessService,
  type VerificationLevelAccessResult,
} from './verification-level-access.service.js';
import { VerificationService } from './verification.service.js';

export interface EvaluateVerificationCapabilityAccessInput {
  readonly accountId: string;
  readonly requiredLevel: VerificationRecord['level'];
  readonly now: string;
}

@Injectable()
export class VerificationCapabilityAccessService {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly levelAccessService: VerificationLevelAccessService,
  ) {}

  async evaluate(
    input: EvaluateVerificationCapabilityAccessInput,
  ): Promise<VerificationLevelAccessResult> {
    const usableRecord =
      await this.verificationService.findUsableRecordForAccount(
        input.accountId,
        input.now,
      );

    return this.levelAccessService.evaluate(
      input.requiredLevel,
      usableRecord,
    );
  }
}

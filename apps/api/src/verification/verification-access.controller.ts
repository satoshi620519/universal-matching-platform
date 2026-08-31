import { Controller, Get, Query } from '@nestjs/common';
import type { VerificationRecord } from '@universal/domain';
import { VerificationAccessService } from './verification-access.service.js';

interface VerificationAccessQuery {
  readonly level: string;
  readonly status: VerificationRecord['status'];
  readonly expiresAt?: string;
  readonly now?: string;
}

@Controller('verification')
export class VerificationAccessController {
  constructor(private readonly verificationAccess: VerificationAccessService) {}

  @Get('access')
  evaluate(@Query() query: VerificationAccessQuery) {
    const level = Number(query.level);

    return this.verificationAccess.evaluate(
      {
        level,
        status: query.status,
        ...(query.expiresAt ? { expiresAt: query.expiresAt } : {}),
      } as VerificationRecord,
      query.now ?? new Date().toISOString(),
    );
  }
}

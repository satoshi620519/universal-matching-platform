import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import type { VerificationRecord } from '@universal/domain';
import { VerificationAccessService } from './verification-access.service.js';

interface VerificationAccessQuery {
  readonly level: string;
  readonly status: string;
  readonly expiresAt?: string;
  readonly now?: string;
}

const levels = new Set(['0', '1', '2', '3']);
const statuses = new Set(['not-started', 'pending', 'verified', 'failed', 'expired', 'revoked']);

function parseLevel(value: string): VerificationRecord['level'] {
  if (!levels.has(value)) throw new BadRequestException('level must be an integer from 0 to 3');
  return Number(value) as VerificationRecord['level'];
}

function parseIso(value: string, field: string): string {
  if (Number.isNaN(new Date(value).getTime())) throw new BadRequestException(`${field} must be a valid ISO date-time`);
  return value;
}

@Controller('verification')
export class VerificationAccessController {
  constructor(private readonly verificationAccess: VerificationAccessService) {}

  @Get('access')
  evaluate(@Query() query: VerificationAccessQuery) {
    if (!statuses.has(query.status)) throw new BadRequestException('status is invalid');

    return this.verificationAccess.evaluate(
      {
        level: parseLevel(query.level),
        status: query.status as VerificationRecord['status'],
        ...(query.expiresAt ? { expiresAt: parseIso(query.expiresAt, 'expiresAt') } : {}),
      },
      query.now ? parseIso(query.now, 'now') : new Date().toISOString(),
    );
  }
}

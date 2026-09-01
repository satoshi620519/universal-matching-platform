import { BadRequestException, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';

import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { PrivilegedFailedEmailOutboxService } from './privileged-failed-email-outbox.service.js';

function parseLimit(value: string | undefined): number {
  if (value === undefined) return 50;
  if (!/^(?:[1-9]|[1-9][0-9]|100)$/.test(value)) {
    throw new BadRequestException('limit must be an integer between 1 and 100');
  }
  return Number(value);
}

@Controller('administration/failed-email-outbox')
export class AdministrativeFailedEmailOutboxController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly outbox: PrivilegedFailedEmailOutboxService,
  ) {}

  @Get()
  async list(
    @Query('limit') limit: string | undefined,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'administration-failed-email-outbox-list',
    });
    return this.outbox.list(principal.accountId, parseLimit(limit));
  }

  @Post(':id/requeue')
  async requeue(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    if (!id.trim()) throw new BadRequestException('id is required');
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'administration-failed-email-outbox-requeue',
    });
    return { requeued: await this.outbox.requeue(principal.accountId, id) };
  }
}

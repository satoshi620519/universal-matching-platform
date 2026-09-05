import { Body, Controller, Delete, Headers, HttpStatus, Param, Post } from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { UserBlockRepository } from './user-block.repository.js';

@Controller('blocks')
export class UserBlockController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly blocks: UserBlockRepository,
  ) {}

  @Post(':accountId')
  async block(
    @Param('accountId') accountId: string,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'user-block-create',
    });
    const blockedAccountId = accountId.trim();
    const block = await this.blocks.create(principal.accountId, blockedAccountId);
    return { block };
  }

  @Delete(':accountId')
  async unblock(
    @Param('accountId') accountId: string,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'user-block-remove',
    });
    const removed = await this.blocks.remove(principal.accountId, accountId.trim());
    return removed ? { removed: true } : { statusCode: HttpStatus.NOT_FOUND, removed: false };
  }
}

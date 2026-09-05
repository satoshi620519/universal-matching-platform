import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Headers,
} from '@nestjs/common';
import { AccountLookupService } from './account-lookup.service.js';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';

@Controller('accounts')
export class AccountLookupController {
  constructor(
    private readonly accountLookup: AccountLookupService,
    private readonly principal: RequestPrincipalResolver,
  ) {}

  @Get(':accountId')
  async findById(
    @Param('accountId') accountId: string,
    @Headers('authorization') authorization?: string,
  ) {
    if (accountId.trim().length === 0) {
      throw new BadRequestException('accountId is required');
    }

    await this.principal.requireAuthenticated({
      authorization,
      requestId: 'account-lookup',
    });

    const account = await this.accountLookup.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }
}

import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { AccountLookupService } from './account-lookup.service.js';

@Controller('accounts')
export class AccountLookupController {
  constructor(private readonly accountLookup: AccountLookupService) {}

  @Get(':accountId')
  async findById(@Param('accountId') accountId: string) {
    if (accountId.trim().length === 0) {
      throw new BadRequestException('accountId is required');
    }

    const account = await this.accountLookup.findById(accountId);
    if (!account) {
      throw new BadRequestException('account not found');
    }

    return account;
  }
}

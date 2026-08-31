import { Controller, Get, NotFoundException, Headers } from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AccountLookupService } from './account-lookup.service.js';

@Controller('accounts')
export class AuthenticatedAccountLookupController {
  constructor(
    private readonly accountLookup: AccountLookupService,
    private readonly principalResolver: RequestPrincipalResolver,
  ) {}

  @Get('authenticated')
  async findAuthenticatedAccount(
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'account-lookup-authenticated',
    });

    const account = await this.accountLookup.findById(principal.accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }
}

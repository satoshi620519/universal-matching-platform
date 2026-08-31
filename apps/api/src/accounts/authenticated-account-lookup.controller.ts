import { Controller, Get, Headers } from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';

@Controller('accounts')
export class AuthenticatedAccountLookupController {
  constructor(
    private readonly accountContext: AuthenticatedAccountContextService,
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

    const { account } = await this.accountContext.resolve(principal);
    return account;
  }
}

import { Controller, Get, Headers, Param } from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';
import { AccountLookupService } from './account-lookup.service.js';

@Controller('administration/accounts')
export class AdministrativeAccountLookupController {
  constructor(
    private readonly accounts: AccountLookupService,
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly capabilities: AdministrativeCapabilityAccessService,
  ) {}

  @Get(':accountId')
  async findById(
    @Param('accountId') accountId: string,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'administrative-account-lookup',
    });
    await this.capabilities.require(principal.accountId, 'lookup-accounts');
    return this.accounts.findById(accountId);
  }
}

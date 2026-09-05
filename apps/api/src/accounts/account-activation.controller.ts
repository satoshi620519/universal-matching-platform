import {
  Controller,
  Headers,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AccountActivationService } from './account-activation.service.js';
import { AccountRepository } from './account.repository.js';

@Controller('accounts')
export class AccountActivationController {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly activation: AccountActivationService,
    private readonly principalResolver: RequestPrincipalResolver,
  ) {}

  @Patch(':accountId/activation')
  async activate(
    @Param('accountId') accountId: string,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ): Promise<{ readonly accountId: string; readonly state: 'active' }> {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'account-activation-legacy-route',
    });
    const normalizedAccountId = accountId.trim();
    if (principal.accountId !== normalizedAccountId) {
      throw new NotFoundException('Account not found');
    }

    const account = await this.accounts.findById(normalizedAccountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const result = this.activation.activate(account.status);
    const persisted = await this.accounts.updateStatus(account.id, result.state);

    if (!persisted) {
      throw new NotFoundException('Account not found');
    }

    return {
      accountId: persisted.id,
      state: persisted.status as 'active',
    };
  }
}

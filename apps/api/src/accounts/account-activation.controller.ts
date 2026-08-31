import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { AccountActivationService } from './account-activation.service.js';
import { AccountRepository } from './account.repository.js';

interface ActivateAccountBody {
  readonly currentState?: string;
}

@Controller('accounts')
export class AccountActivationController {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly activation: AccountActivationService,
  ) {}

  @Patch(':accountId/activation')
  async activate(
    @Param('accountId') accountId: string,
    @Body() _body: ActivateAccountBody,
  ): Promise<{ readonly accountId: string; readonly state: 'active' }> {
    const account = await this.accounts.findById(accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const result = this.activation.activate(account.status);

    return {
      accountId: account.id,
      state: result.state,
    };
  }
}

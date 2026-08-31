import {
  Controller,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { AccountActivationService } from './account-activation.service.js';
import { AccountRepository } from './account.repository.js';

@Controller('accounts')
export class AccountActivationController {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly activation: AccountActivationService,
  ) {}

  @Patch(':accountId/activation')
  async activate(
    @Param('accountId') accountId: string,
  ): Promise<{ readonly accountId: string; readonly state: 'active' }> {
    const account = await this.accounts.findById(accountId);

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
      state: result.state,
    };
  }
}

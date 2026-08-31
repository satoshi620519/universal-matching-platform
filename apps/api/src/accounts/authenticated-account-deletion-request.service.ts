import { Injectable, NotFoundException } from '@nestjs/common';
import type { RequestPrincipal } from '../auth/request-principal.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';
import { AccountDeletionRequestService } from './account-deletion-request.service.js';
import { AccountRepository } from './account.repository.js';

@Injectable()
export class AuthenticatedAccountDeletionRequestService {
  constructor(
    private readonly context: AuthenticatedAccountContextService,
    private readonly deletion: AccountDeletionRequestService,
    private readonly accounts: AccountRepository,
  ) {}

  async requestDeletion(principal: RequestPrincipal) {
    const { account } = await this.context.resolve(principal);
    const result = this.deletion.requestDeletion(account.status);
    const persisted = await this.accounts.updateStatus(account.id, result.state);

    if (!persisted) {
      throw new NotFoundException('Account not found');
    }

    return { accountId: persisted.id, state: result.state };
  }
}

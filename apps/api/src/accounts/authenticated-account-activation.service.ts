import { Injectable, NotFoundException } from '@nestjs/common';
import type { RequestPrincipal } from '../auth/request-principal.js';
import { AccountActivationService } from './account-activation.service.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';
import { AccountRepository } from './account.repository.js';

export interface AuthenticatedAccountActivationResult {
  readonly accountId: string;
  readonly state: 'active';
}

@Injectable()
export class AuthenticatedAccountActivationService {
  constructor(
    private readonly context: AuthenticatedAccountContextService,
    private readonly activation: AccountActivationService,
    private readonly accounts: AccountRepository,
  ) {}

  async activate(principal: RequestPrincipal): Promise<AuthenticatedAccountActivationResult> {
    const { account } = await this.context.resolve(principal);
    const result = this.activation.activate(account.status);
    const persisted = await this.accounts.updateStatus(account.id, result.state);

    if (!persisted) {
      throw new NotFoundException('Account not found');
    }

    return { accountId: persisted.id, state: result.state };
  }
}

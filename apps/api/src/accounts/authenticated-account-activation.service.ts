import { Injectable } from '@nestjs/common';
import type { RequestPrincipal } from '../auth/request-principal.js';
import { AccountActivationService } from './account-activation.service.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';

export interface AuthenticatedAccountActivationResult {
  readonly accountId: string;
  readonly state: 'active';
}

@Injectable()
export class AuthenticatedAccountActivationService {
  constructor(
    private readonly context: AuthenticatedAccountContextService,
    private readonly activation: AccountActivationService,
  ) {}

  async activate(principal: RequestPrincipal): Promise<AuthenticatedAccountActivationResult> {
    const { account } = await this.context.resolve(principal);
    const result = this.activation.activate(account.status);

    return { accountId: account.id, state: result.state };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import type { RequestPrincipal } from '../auth/request-principal.js';
import { AccountRepository, type AccountRecord } from './account.repository.js';

export interface AuthenticatedAccountContext {
  readonly principal: RequestPrincipal;
  readonly account: AccountRecord;
}

@Injectable()
export class AuthenticatedAccountContextService {
  constructor(private readonly accounts: AccountRepository) {}

  async resolve(principal: RequestPrincipal): Promise<AuthenticatedAccountContext> {
    const account = await this.accounts.findById(principal.accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return { principal, account };
  }
}

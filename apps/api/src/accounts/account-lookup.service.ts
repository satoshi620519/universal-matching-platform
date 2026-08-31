import { Injectable } from '@nestjs/common';
import { AccountRepository, type AccountRecord } from './account.repository.js';

@Injectable()
export class AccountLookupService {
  constructor(private readonly accounts: AccountRepository) {}

  async findById(id: string): Promise<AccountRecord | null> {
    return this.accounts.findById(id);
  }
}

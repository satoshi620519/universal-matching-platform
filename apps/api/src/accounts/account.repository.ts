import type { AccountState } from '@universal/domain';

export interface AccountRecord {
  readonly id: string;
  readonly status: AccountState;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateAccountRecord {
  readonly id?: string;
  readonly status: AccountState;
}

export abstract class AccountRepository {
  abstract create(input: CreateAccountRecord): Promise<AccountRecord>;
  abstract findById(id: string): Promise<AccountRecord | null>;
}

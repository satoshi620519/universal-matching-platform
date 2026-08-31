import type { AccountState } from '@universal/domain';

export interface CreatePasswordRegistrationInput {
  readonly accountStatus: AccountState;
  readonly providerType: string;
  readonly providerSubject: string;
  readonly passwordHash: string;
}

export interface PasswordRegistrationRecord {
  readonly account: {
    readonly id: string;
    readonly status: AccountState;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
  readonly authenticationIdentity: {
    readonly id: string;
    readonly accountId: string;
    readonly providerType: string;
    readonly providerSubject: string;
    readonly status: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
}

export abstract class PasswordRegistrationRepository {
  abstract create(
    input: CreatePasswordRegistrationInput,
  ): Promise<PasswordRegistrationRecord>;
}

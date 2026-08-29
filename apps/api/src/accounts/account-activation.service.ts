import { Injectable } from '@nestjs/common';
import { AccountState, canTransitionAccountState } from '@universal/domain/account.js';

export interface AccountActivationResult {
  readonly state: 'active';
}

@Injectable()
export class AccountActivationService {
  activate(currentState: AccountState): AccountActivationResult {
    if (!canTransitionAccountState(currentState, 'active')) {
      throw new Error(`Account cannot be activated from state: ${currentState}`);
    }

    return { state: 'active' };
  }
}

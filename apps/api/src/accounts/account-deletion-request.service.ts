import { Injectable } from '@nestjs/common';
import { AccountState, canTransitionAccountState } from '@universal/domain';

@Injectable()
export class AccountDeletionRequestService {
  requestDeletion(currentState: AccountState): { state: 'pending-deletion' } {
    if (!canTransitionAccountState(currentState, 'pending-deletion')) {
      throw new Error(`Account cannot be marked for deletion from state: ${currentState}`);
    }

    return { state: 'pending-deletion' };
  }
}

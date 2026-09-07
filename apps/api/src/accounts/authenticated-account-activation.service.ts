import { Injectable, NotFoundException } from '@nestjs/common';
import type { RequestPrincipal } from '../auth/request-principal.js';
import { AccountActivationService } from './account-activation.service.js';
import { AuthenticatedAccountContextService } from './authenticated-account-context.service.js';
import { AccountRepository } from './account.repository.js';
import { AnalyticsEventRecordingService } from '../analytics/analytics-event-recording.service.js';

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
    private readonly analytics: AnalyticsEventRecordingService,
  ) {}

  async activate(principal: RequestPrincipal): Promise<AuthenticatedAccountActivationResult> {
    const { account } = await this.context.resolve(principal);
    const result = this.activation.activate(account.status);
    const persisted = await this.accounts.updateStatus(account.id, result.state);

    if (!persisted) {
      throw new NotFoundException('Account not found');
    }

    void this.analytics.recordBusinessEvent('registration_completed');
    return { accountId: persisted.id, state: result.state };
  }
}

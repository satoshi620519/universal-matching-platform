import { Injectable } from '@nestjs/common';

import { classifyEmailDeliveryFailure } from './email-delivery-failure.js';
import { EmailOutboxRepository } from './email-outbox.repository.js';
import { EmailVerificationDeliveryService } from './email-verification-delivery.service.js';

@Injectable()
export class EmailOutboxDispatchService {
  constructor(
    private readonly outbox: EmailOutboxRepository,
    private readonly verificationDelivery: EmailVerificationDeliveryService,
  ) {}

  async dispatchOne(): Promise<boolean> {
    const now = new Date();
    const message = await this.outbox.claimNext(now);
    if (!message) {
      return false;
    }

    try {
      if (message.kind === 'email-verification') {
        await this.verificationDelivery.issueAndDeliver({
          accountId: message.accountId,
          emailAddress: message.emailAddress,
          messageId: message.id,
        });
      }
      await this.outbox.markDelivered(message.id, new Date());
      return true;
    } catch (error) {
      const failure = classifyEmailDeliveryFailure(error);
      const failureError = failure.kind + ': ' + failure.message;

      if (failure.kind === 'permanent') {
        await this.outbox.markFailed(message.id, {
          failedAt: new Date(),
          error: failureError,
        });
        return false;
      }

      const delayMs = Math.min(60_000 * 2 ** Math.min(message.attempts, 6), 60 * 60_000);
      await this.outbox.reschedule(message.id, {
        availableAt: new Date(Date.now() + delayMs),
        error: failureError,
      });
      return false;
    }
  }
}

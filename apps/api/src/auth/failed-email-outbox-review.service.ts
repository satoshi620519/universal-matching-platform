import { Injectable } from '@nestjs/common';

import {
  FailedEmailOutboxRepository,
  type FailedEmailOutboxMessage,
} from './failed-email-outbox.repository.js';

@Injectable()
export class FailedEmailOutboxReviewService {
  constructor(private readonly failedOutbox: FailedEmailOutboxRepository) {}

  async list(limit = 50): Promise<readonly FailedEmailOutboxMessage[]> {
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('limit must be an integer between 1 and 100');
    }
    return this.failedOutbox.listFailed({ limit });
  }

  async requeue(id: string): Promise<boolean> {
    return this.failedOutbox.requeueFailed(id, { availableAt: new Date() });
  }
}

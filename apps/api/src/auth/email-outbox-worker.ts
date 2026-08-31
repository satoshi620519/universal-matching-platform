import { Injectable } from '@nestjs/common';

import { EmailOutboxDispatchService } from './email-outbox-dispatch.service.js';

@Injectable()
export class EmailOutboxWorker {
  constructor(private readonly dispatcher: EmailOutboxDispatchService) {}

  async runOnce(): Promise<boolean> {
    return this.dispatcher.dispatchOne();
  }

  async drain(maxMessages: number): Promise<number> {
    let processed = 0;
    while (processed < maxMessages && await this.dispatcher.dispatchOne()) {
      processed += 1;
    }
    return processed;
  }
}

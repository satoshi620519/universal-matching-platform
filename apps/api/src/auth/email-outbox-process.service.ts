import { Injectable, Logger } from '@nestjs/common';

import { EmailOutboxWorker } from './email-outbox-worker.js';

export interface EmailOutboxRunSummary {
  readonly processed: number;
  readonly startedAt: Date;
  readonly finishedAt: Date;
}

@Injectable()
export class EmailOutboxProcessService {
  private readonly logger = new Logger(EmailOutboxProcessService.name);

  constructor(private readonly worker: EmailOutboxWorker) {}

  async runBatch(maxMessages = 100): Promise<EmailOutboxRunSummary> {
    const startedAt = new Date();
    const processed = await this.worker.drain(maxMessages);
    const finishedAt = new Date();

    this.logger.log({
      event: 'email_outbox_batch_completed',
      processed,
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    });

    return { processed, startedAt, finishedAt };
  }
}

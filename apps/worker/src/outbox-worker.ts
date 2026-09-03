export interface OutboxEvent<TPayload = unknown> {
  readonly id: string;
  readonly type: string;
  readonly payload: TPayload;
}

export interface OutboxEventStore<TEvent extends OutboxEvent = OutboxEvent> {
  claim(limit: number): Promise<readonly TEvent[]>;
  markProcessed(eventId: string): Promise<void>;
  releaseForRetry(eventId: string, error: unknown): Promise<void>;
}

export interface IdempotencyStore {
  hasProcessed(eventId: string): Promise<boolean>;
  markProcessed(eventId: string): Promise<void>;
}

export interface OutboxEventHandler<TEvent extends OutboxEvent = OutboxEvent> {
  handle(event: TEvent): Promise<void>;
}

export interface OutboxWorkerOptions {
  readonly batchSize?: number;
  readonly maxAttempts?: number;
}

/**
 * Framework-neutral at-least-once outbox processor.
 * Persistence, locking, retries and queue transport stay behind explicit adapters.
 */
export class OutboxWorker<TEvent extends OutboxEvent = OutboxEvent> {
  private readonly batchSize: number;
  private readonly maxAttempts: number;

  constructor(
    private readonly store: OutboxEventStore<TEvent>,
    private readonly idempotency: IdempotencyStore,
    private readonly handler: OutboxEventHandler<TEvent>,
    options: OutboxWorkerOptions = {},
  ) {
    this.batchSize = options.batchSize ?? 100;
    this.maxAttempts = options.maxAttempts ?? 5;

    if (!Number.isSafeInteger(this.batchSize) || this.batchSize < 1 || this.batchSize > 1000) {
      throw new Error('batchSize must be an integer between 1 and 1000');
    }
    if (!Number.isSafeInteger(this.maxAttempts) || this.maxAttempts < 1 || this.maxAttempts > 20) {
      throw new Error('maxAttempts must be an integer between 1 and 20');
    }
  }

  async runBatch(): Promise<number> {
    const events = await this.store.claim(this.batchSize);
    let processed = 0;

    for (const event of events) {
      if (await this.idempotency.hasProcessed(event.id)) {
        await this.store.markProcessed(event.id);
        processed += 1;
        continue;
      }

      try {
        await this.handler.handle(event);
        await this.idempotency.markProcessed(event.id);
        await this.store.markProcessed(event.id);
        processed += 1;
      } catch (error) {
        await this.store.releaseForRetry(event.id, error);
      }
    }

    return processed;
  }
}

/** Exponential retry delay used by queue adapters: 1s, 2s, 4s, ... capped at 60s. */
export function retryDelayMs(attempt: number): number {
  if (!Number.isSafeInteger(attempt) || attempt < 1) {
    throw new Error('attempt must be a positive integer');
  }
  return Math.min(60_000, 1_000 * 2 ** (attempt - 1));
}

export function shouldRetry(attempt: number, maxAttempts = 5): boolean {
  return attempt < maxAttempts;
}

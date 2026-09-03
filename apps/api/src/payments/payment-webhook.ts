export type PaymentWebhookEventType =
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.cancelled';

export interface PaymentWebhookEvent {
  readonly eventId: string;
  readonly type: PaymentWebhookEventType;
  readonly providerReference: string;
  readonly intentId: string;
  readonly occurredAt: Date;
}

export interface PaymentWebhookIdempotencyRecord {
  readonly eventId: string;
  readonly processedAt: Date;
}

/** Storage boundary for exactly-once effects on at-least-once provider webhooks. */
export abstract class PaymentWebhookIdempotencyStore {
  abstract claim(eventId: string): Promise<boolean>;
}

/** Provider-neutral webhook boundary; provider signature parsing stays outside the domain. */
export abstract class PaymentWebhookHandler {
  constructor(protected readonly idempotencyStore: PaymentWebhookIdempotencyStore) {}

  async shouldProcess(event: PaymentWebhookEvent): Promise<boolean> {
    return this.idempotencyStore.claim(event.eventId);
  }
}

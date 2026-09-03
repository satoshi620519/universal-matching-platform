import { describe, expect, it } from 'vitest';

import {
  PaymentWebhookHandler,
  PaymentWebhookIdempotencyStore,
  type PaymentWebhookEvent,
} from './payment-webhook.js';

class InMemoryIdempotencyStore extends PaymentWebhookIdempotencyStore {
  private readonly claimed = new Set<string>();

  async claim(eventId: string): Promise<boolean> {
    if (this.claimed.has(eventId)) return false;
    this.claimed.add(eventId);
    return true;
  }
}

class TestWebhookHandler extends PaymentWebhookHandler {}

const event: PaymentWebhookEvent = {
  eventId: 'evt-1',
  type: 'payment.succeeded',
  providerReference: 'provider:intent-1',
  intentId: 'intent-1',
  occurredAt: new Date('2026-09-03T00:00:00.000Z'),
};

describe('PaymentWebhookHandler', () => {
  it('accepts the first event and rejects a duplicate event id', async () => {
    const handler = new TestWebhookHandler(new InMemoryIdempotencyStore());

    await expect(handler.shouldProcess(event)).resolves.toBe(true);
    await expect(handler.shouldProcess(event)).resolves.toBe(false);
  });
});

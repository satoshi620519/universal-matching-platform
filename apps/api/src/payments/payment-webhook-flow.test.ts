import { describe, expect, it } from 'vitest';
import { InMemoryPaymentProvider } from './in-memory-payment-provider.js';
import { PaymentWebhookProcessor, type PaymentEntitlementService } from './payment-webhook-processor.js';
import { PaymentWebhookIdempotencyStore, type PaymentWebhookEvent } from './payment-webhook.js';

class Store extends PaymentWebhookIdempotencyStore {
  private readonly ids = new Set<string>();
  async claim(eventId: string): Promise<boolean> { if (this.ids.has(eventId)) return false; this.ids.add(eventId); return true; }
}

describe('payment webhook flow', () => {
  it('grants exactly once for duplicate verified success deliveries', async () => {
    const provider = new InMemoryPaymentProvider();
    const created = await provider.createPaymentIntent({ intentId: 'intent-flow-1', accountId: 'account-flow-1', idempotencyKey: 'key-flow-1', amountMinor: 1000, currency: 'JPY' });
    provider.setStatus(created.providerReference, 'succeeded');
    const calls: string[] = [];
    const entitlements: PaymentEntitlementService = {
      grantFromPayment: async input => { calls.push('grant:' + input.intentId); },
      revokeFromPayment: async input => { calls.push('revoke:' + input.intentId); },
    };
    const processor = new PaymentWebhookProcessor(new Store(), provider, entitlements);
    const event: PaymentWebhookEvent = { eventId: 'evt-flow-1', type: 'payment.succeeded', providerReference: created.providerReference, intentId: 'intent-flow-1', occurredAt: new Date() };
    await expect(processor.process(event, { accountId: 'account-flow-1', entitlementKey: 'premium' })).resolves.toBe(true);
    await expect(processor.process(event, { accountId: 'account-flow-1', entitlementKey: 'premium' })).resolves.toBe(false);
    expect(calls).toEqual(['grant:intent-flow-1']);
  });

  it('does not grant when provider state disagrees with success webhook', async () => {
    const provider = new InMemoryPaymentProvider();
    const created = await provider.createPaymentIntent({ intentId: 'intent-flow-2', accountId: 'account-flow-2', idempotencyKey: 'key-flow-2', amountMinor: 1000, currency: 'JPY' });
    let grants = 0;
    const entitlements: PaymentEntitlementService = { grantFromPayment: async () => { grants++; }, revokeFromPayment: async () => {} };
    const processor = new PaymentWebhookProcessor(new Store(), provider, entitlements);
    const event: PaymentWebhookEvent = { eventId: 'evt-flow-2', type: 'payment.succeeded', providerReference: created.providerReference, intentId: 'intent-flow-2', occurredAt: new Date() };
    await expect(processor.process(event, { accountId: 'account-flow-2', entitlementKey: 'premium' })).resolves.toBe(false);
    expect(grants).toBe(0);
  });
});

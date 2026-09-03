import { describe, expect, it } from 'vitest';
import { PaymentProvider } from './payment-provider.js';
import { PaymentWebhookIdempotencyStore, type PaymentWebhookEvent } from './payment-webhook.js';
import { PaymentWebhookProcessor, type PaymentEntitlementService } from './payment-webhook-processor.js';

class Store extends PaymentWebhookIdempotencyStore { private ids = new Set<string>(); async claim(id: string) { if (this.ids.has(id)) return false; this.ids.add(id); return true; } }
class Provider extends PaymentProvider {
  async createPaymentIntent() { return { providerReference: 'ref-1' }; }
  async getPaymentIntent() { return { providerReference: 'ref-1', status: 'succeeded' as const, amountMinor: 1000, currency: 'JPY' }; }
}

const calls: string[] = [];
const entitlement: PaymentEntitlementService = {
  async grantFromPayment(input) { calls.push('grant:' + input.intentId); },
  async revokeFromPayment(input) { calls.push('revoke:' + input.intentId); },
};
const event: PaymentWebhookEvent = { eventId: 'evt-processor-1', type: 'payment.succeeded', providerReference: 'ref-1', intentId: 'intent-1', occurredAt: new Date() };

describe('PaymentWebhookProcessor', () => {
  it('grants once only after provider state confirms success', async () => {
    calls.length = 0;
    const processor = new PaymentWebhookProcessor(new Store(), new Provider(), entitlement);
    await expect(processor.process(event, { accountId: 'account-1', entitlementKey: 'premium' })).resolves.toBe(true);
    await expect(processor.process(event, { accountId: 'account-1', entitlementKey: 'premium' })).resolves.toBe(false);
    expect(calls).toEqual(['grant:intent-1']);
  });
});

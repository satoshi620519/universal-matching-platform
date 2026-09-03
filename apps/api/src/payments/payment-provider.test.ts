import { describe, expect, it } from 'vitest';

import {
  PaymentProvider,
  type PaymentIntentRequest,
  type PaymentIntentResult,
} from './payment-provider.js';

class FakePaymentProvider extends PaymentProvider {
  async createPaymentIntent(input: PaymentIntentRequest) {
    expect(input.idempotencyKey).toBe('idem-1');
    return { providerReference: `provider:${input.intentId}` };
  }

  async getPaymentIntent(providerReference: string): Promise<PaymentIntentResult | null> {
    if (providerReference !== 'provider:intent-1') return null;
    return {
      providerReference,
      status: 'succeeded',
      amountMinor: 1000,
      currency: 'JPY',
    };
  }
}

describe('PaymentProvider', () => {
  it('keeps provider operations behind the provider-neutral contract', async () => {
    const provider = new FakePaymentProvider();
    const request: PaymentIntentRequest = {
      intentId: 'intent-1',
      accountId: 'account-1',
      amountMinor: 1000,
      currency: 'JPY',
      entitlementKey: 'premium',
      idempotencyKey: 'idem-1',
    };

    await expect(provider.createPaymentIntent(request)).resolves.toEqual({
      providerReference: 'provider:intent-1',
    });
    await expect(provider.getPaymentIntent('provider:intent-1')).resolves.toEqual({
      providerReference: 'provider:intent-1',
      status: 'succeeded',
      amountMinor: 1000,
      currency: 'JPY',
    });
    await expect(provider.getPaymentIntent('unknown')).resolves.toBeNull();
  });
});

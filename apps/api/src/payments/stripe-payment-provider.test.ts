import { describe, expect, it } from 'vitest';
import { StripePaymentProvider, type StripeHttpClient } from './stripe-payment-provider.js';

describe('StripePaymentProvider', () => {
  it('maps payment intent creation without leaking Stripe types into the domain contract', async () => {
    let request: unknown;
    const client: StripeHttpClient = { request: async (input) => {
      request = input;
      return { id: 'pi_123' };
    }};
    const provider = new StripePaymentProvider(client);
    await expect(provider.createPaymentIntent({
      intentId: 'intent-1',
      accountId: 'account-1',
      amountMinor: 1200,
      currency: 'JPY',
      entitlementKey: 'premium',
      idempotencyKey: 'idem-1',
    })).resolves.toEqual({ providerReference: 'pi_123' });
    expect(request).toEqual({
      method: 'POST',
      path: '/v1/payment_intents',
      form: {
        amount: '1200',
        currency: 'jpy',
        'metadata[intent_id]': 'intent-1',
        'metadata[account_id]': 'account-1',
        'metadata[entitlement_key]': 'premium',
      },
    });
  });

  it('maps Stripe lifecycle states into provider-neutral states', async () => {
    const client: StripeHttpClient = { request: async () => ({
      id: 'pi_456', status: 'succeeded', amount: 500, currency: 'usd',
    })};
    const provider = new StripePaymentProvider(client);
    await expect(provider.getPaymentIntent('pi_456')).resolves.toEqual({
      providerReference: 'pi_456', status: 'succeeded', amountMinor: 500, currency: 'USD',
    });
  });

  it('does not fabricate a payment state from an unknown provider payload', async () => {
    const client: StripeHttpClient = { request: async () => ({ id: 'pi_unknown', status: 'unknown', amount: 500, currency: 'usd' })};
    await expect(new StripePaymentProvider(client).getPaymentIntent('pi_unknown')).resolves.toBeNull();
  });
});

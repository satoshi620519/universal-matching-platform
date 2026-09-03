import { describe, expect, it } from 'vitest';
import { loadPaymentProviderConfig } from './payment-provider-config.js';

describe('payment provider composition contract', () => {
  it('keeps local as the explicit safe default', () => {
    expect(loadPaymentProviderConfig({}).mode).toBe('local');
  });

  it('does not permit Stripe composition without validated credentials', () => {
    expect(() => loadPaymentProviderConfig({
      PAYMENT_PROVIDER: 'stripe',
      STRIPE_SECRET_KEY: '',
      STRIPE_WEBHOOK_SECRET: '',
    })).toThrow();
  });

  it('permits production adapter selection only through explicit Stripe mode', () => {
    expect(loadPaymentProviderConfig({
      PAYMENT_PROVIDER: 'stripe',
      STRIPE_SECRET_KEY: 'sk_test',
      STRIPE_WEBHOOK_SECRET: 'whsec_test',
    }).mode).toBe('stripe');
  });
});

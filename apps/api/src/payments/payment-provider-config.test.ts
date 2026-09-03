import { describe, expect, it } from 'vitest';
import { loadPaymentProviderConfig } from './payment-provider-config.js';

describe('loadPaymentProviderConfig', () => {
  it('defaults to local mode without production secrets', () => {
    expect(loadPaymentProviderConfig({})).toEqual({ mode: 'local' });
  });

  it('requires both Stripe secrets in Stripe mode', () => {
    expect(() => loadPaymentProviderConfig({ PAYMENT_PROVIDER: 'stripe' })).toThrow('STRIPE_SECRET_KEY');
    expect(() => loadPaymentProviderConfig({ PAYMENT_PROVIDER: 'stripe', STRIPE_SECRET_KEY: 'sk_test' })).toThrow('STRIPE_WEBHOOK_SECRET');
  });

  it('loads explicit Stripe mode only with both secrets', () => {
    expect(loadPaymentProviderConfig({
      PAYMENT_PROVIDER: 'stripe',
      STRIPE_SECRET_KEY: 'sk_test',
      STRIPE_WEBHOOK_SECRET: 'whsec_test',
    })).toEqual({
      mode: 'stripe',
      stripeSecretKey: 'sk_test',
      stripeWebhookSecret: 'whsec_test',
    });
  });

  it('rejects unknown provider modes instead of silently falling back', () => {
    expect(() => loadPaymentProviderConfig({ PAYMENT_PROVIDER: 'unknown' })).toThrow('PAYMENT_PROVIDER');
  });
});

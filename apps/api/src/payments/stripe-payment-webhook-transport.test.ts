import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { StripePaymentWebhookTransport } from './stripe-payment-webhook-transport.js';

const secret = 'test-secret';
const payload = {
  id: 'evt_stripe_1',
  type: 'payment_intent.succeeded',
  data: {
    object: {
      id: 'pi_123',
      created: 1_700_000_000,
      metadata: { account_id: 'account-1', intent_id: 'intent-1', entitlement_key: 'premium' },
    },
  },
};
const signature = createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

describe('StripePaymentWebhookTransport', () => {
  it('accepts a signed provider event and projects only verified context', async () => {
    const transport = new StripePaymentWebhookTransport({ getSecret: () => secret });
    await expect(transport.verifyAndParse({ signature, payload })).resolves.toMatchObject({
      event: { eventId: 'evt_stripe_1', type: 'payment.succeeded', providerReference: 'pi_123', intentId: 'intent-1' },
      context: { accountId: 'account-1', entitlementKey: 'premium' },
    });
  });

  it('rejects a tampered provider event', async () => {
    const transport = new StripePaymentWebhookTransport({ getSecret: () => secret });
    await expect(transport.verifyAndParse({ signature: 'bad', payload })).rejects.toThrow('invalid Stripe webhook signature');
  });

  it('rejects events without signed account context metadata', async () => {
    const missingMetadata = { ...payload, data: { object: { ...payload.data.object, metadata: {} } } };
    const validSignature = createHmac('sha256', secret).update(JSON.stringify(missingMetadata)).digest('hex');
    const transport = new StripePaymentWebhookTransport({ getSecret: () => secret });
    await expect(transport.verifyAndParse({ signature: validSignature, payload: missingMetadata })).rejects.toThrow('missing Stripe payment metadata');
  });
});

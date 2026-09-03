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
const rawBody = JSON.stringify(payload);
const signature = createHmac('sha256', secret).update(rawBody).digest('hex');

describe('StripePaymentWebhookTransport', () => {
  it('accepts a signed exact provider body and projects only verified context', async () => {
    const transport = new StripePaymentWebhookTransport({ getSecret: () => secret });
    await expect(transport.verifyAndParse({ signature: 't=1700000000,v1=' + signature, rawBody, payload })).resolves.toMatchObject({
      event: { eventId: 'evt_stripe_1', type: 'payment.succeeded', providerReference: 'pi_123', intentId: 'intent-1' },
      context: { accountId: 'account-1', entitlementKey: 'premium' },
    });
  });

  it('rejects a tampered provider event', async () => {
    const transport = new StripePaymentWebhookTransport({ getSecret: () => secret });
    await expect(transport.verifyAndParse({ signature: 'bad', rawBody, payload })).rejects.toThrow('invalid Stripe webhook signature');
  });

  it('rejects reserialized payload verification when exact raw body is absent', async () => {
    const transport = new StripePaymentWebhookTransport({ getSecret: () => secret });
    await expect(transport.verifyAndParse({ signature, payload })).rejects.toThrow('missing raw Stripe webhook body');
  });

  it('rejects events without signed account context metadata', async () => {
    const missingMetadata = { ...payload, data: { object: { ...payload.data.object, metadata: {} } } };
    const missingRawBody = JSON.stringify(missingMetadata);
    const validSignature = createHmac('sha256', secret).update(missingRawBody).digest('hex');
    const transport = new StripePaymentWebhookTransport({ getSecret: () => secret });
    await expect(transport.verifyAndParse({ signature: validSignature, rawBody: missingRawBody, payload: missingMetadata })).rejects.toThrow('missing Stripe payment metadata');
  });
});

import { describe, expect, it } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { PaymentWebhookController } from './payment-webhook.controller.js';
import type { PaymentWebhookProcessor } from './payment-webhook-processor.js';
import type { VerifiedPaymentWebhookTransport } from './payment-webhook-transport.js';

const event = { eventId: 'evt-http-1', type: 'payment.succeeded' as const, providerReference: 'ref-1', intentId: 'intent-1', occurredAt: new Date() };

describe('PaymentWebhookController', () => {
  it('rejects unsigned webhooks before parsing', async () => {
    const controller = new PaymentWebhookController({ verifyAndParse: async () => { throw new Error('must not parse'); } } as unknown as VerifiedPaymentWebhookTransport, {} as PaymentWebhookProcessor);
    await expect(controller.receive({}, undefined)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('forwards provider signature and raw body capability without trusting them itself', async () => {
    let input: unknown;
    const transport = { verifyAndParse: async (actual: unknown) => {
      input = actual;
      return { event, context: { accountId: 'account-1', entitlementKey: 'premium' } };
    }} as unknown as VerifiedPaymentWebhookTransport;
    const processor = { process: async () => true } as unknown as PaymentWebhookProcessor;
    const controller = new PaymentWebhookController(transport, processor);
    await controller.receive({ ignored: true }, undefined, 'stripe-signature', '{"ignored":true}');
    expect(input).toEqual({
      signature: 'stripe-signature',
      rawBody: '{"ignored":true}',
      payload: { ignored: true },
    });
  });

  it('passes only verified data to the processor', async () => {
    let received = false;
    const transport = { verifyAndParse: async () => ({ event, context: { accountId: 'account-1', entitlementKey: 'premium' } }) } as unknown as VerifiedPaymentWebhookTransport;
    const processor = { process: async (actualEvent: unknown, context: unknown) => { received = actualEvent === event && (context as { accountId: string }).accountId === 'account-1'; return true; } } as unknown as PaymentWebhookProcessor;
    const controller = new PaymentWebhookController(transport, processor);
    await expect(controller.receive({ ignored: true }, 'valid')).resolves.toEqual({ accepted: true, processed: true });
    expect(received).toBe(true);
  });
});

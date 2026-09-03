import { createHmac, timingSafeEqual } from 'node:crypto';
import type { PaymentWebhookVerificationInput } from './payment-webhook-transport.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { VerifiedPaymentWebhookTransport, type VerifiedPaymentWebhook } from './payment-webhook-transport.js';

export interface StripeWebhookSecretProvider {
  getSecret(): string | undefined;
}

/**
 * Minimal Stripe event transport: authenticates the raw serialized event before
 * projecting it into the provider-neutral webhook shape. Account context is read
 * only from signed provider metadata.
 */
@Injectable()
export class StripePaymentWebhookTransport extends VerifiedPaymentWebhookTransport {
  constructor(private readonly secrets: StripeWebhookSecretProvider) {
    super();
  }

  async verifyAndParse(input: PaymentWebhookVerificationInput): Promise<VerifiedPaymentWebhook> {
    if (!input.signature || typeof input.payload !== 'object' || !input.payload) {
      throw new UnauthorizedException('invalid Stripe webhook');
    }

    const secret = this.secrets.getSecret();
    if (!secret) throw new UnauthorizedException('Stripe webhook secret is not configured');

    // Stripe-style signatures authenticate the exact bytes delivered on the wire.
    // `rawBody` is mandatory here so JSON reserialization cannot change verification.
    if (typeof input.rawBody !== 'string') throw new UnauthorizedException('missing raw Stripe webhook body');
    const actual = this.extractV1Signature(input.signature);
    const expected = createHmac('sha256', secret).update(input.rawBody).digest('hex');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    const actualBuffer = Buffer.from(actual, 'utf8');
    if (!actual || expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
      throw new UnauthorizedException('invalid Stripe webhook signature');
    }

    const root = input.payload as Record<string, unknown>;
    const data = root.data && typeof root.data === 'object' ? root.data as Record<string, unknown> : undefined;
    const object = data && data.object && typeof data.object === 'object' ? data.object as Record<string, unknown> : undefined;
    if (!object || typeof root.id !== 'string' || typeof root.type !== 'string' || typeof object.id !== 'string' || typeof object.created !== 'number') {
      throw new UnauthorizedException('invalid Stripe webhook payload');
    }

    const metadata = object.metadata && typeof object.metadata === 'object' ? object.metadata as Record<string, unknown> : {};
    const accountId = metadata.account_id;
    const intentId = metadata.intent_id;
    if (typeof accountId !== 'string' || typeof intentId !== 'string') {
      throw new UnauthorizedException('missing Stripe payment metadata');
    }

    const type = root.type === 'payment_intent.succeeded'
      ? 'payment.succeeded'
      : root.type === 'payment_intent.payment_failed'
        ? 'payment.failed'
        : root.type === 'payment_intent.canceled'
          ? 'payment.cancelled'
          : null;
    if (!type) throw new UnauthorizedException('unsupported Stripe webhook event');

    return {
      event: {
        eventId: root.id,
        type,
        providerReference: object.id,
        intentId,
        occurredAt: new Date(object.created * 1000),
      },
      context: {
        accountId,
        ...(typeof metadata.entitlement_key === 'string' ? { entitlementKey: metadata.entitlement_key } : {}),
      },
    };
  }

  private extractV1Signature(signature: string): string | null {
    // Accept a versioned header (`t=...,v1=...`) and the legacy test form.
    const versioned = signature.split(',').map((part) => part.trim()).find((part) => part.startsWith('v1='));
    return versioned ? versioned.slice(3) : signature;
  }
}

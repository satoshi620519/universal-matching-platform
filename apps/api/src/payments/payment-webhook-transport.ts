import { BadRequestException } from '@nestjs/common';
import type { PaymentWebhookEvent } from './payment-webhook.js';
export interface PaymentWebhookTransport {
  verifyAndParse(input: { readonly signature?: string; readonly payload: unknown }): Promise<unknown>;
}

export interface VerifiedPaymentWebhook {
  readonly event: PaymentWebhookEvent;
  readonly context: { readonly accountId: string; readonly entitlementKey?: string };
}

/** Provider-specific implementations must cryptographically verify signatures before returning this shape. */
export abstract class VerifiedPaymentWebhookTransport implements PaymentWebhookTransport {
  abstract verifyAndParse(input: { readonly signature?: string; readonly payload: unknown }): Promise<VerifiedPaymentWebhook>;

  static requireVerified(value: unknown): VerifiedPaymentWebhook {
    if (!value || typeof value !== 'object' || !('event' in value) || !('context' in value)) {
      throw new BadRequestException('invalid verified payment webhook');
    }
    return value as VerifiedPaymentWebhook;
  }
}

import { BadRequestException } from '@nestjs/common';
import type { PaymentWebhookEvent } from './payment-webhook.js';

export interface PaymentWebhookVerificationInput {
  readonly signature?: string;
  /** Exact provider request bytes when signature schemes require raw-body verification. */
  readonly rawBody?: string;
  readonly payload: unknown;
}

export interface PaymentWebhookTransport {
  verifyAndParse(input: PaymentWebhookVerificationInput): Promise<unknown>;
}

export interface VerifiedPaymentWebhook {
  readonly event: PaymentWebhookEvent;
  readonly context: { readonly accountId: string; readonly entitlementKey?: string };
}

/** Provider-specific implementations must cryptographically verify signatures before returning this shape. */
export abstract class VerifiedPaymentWebhookTransport implements PaymentWebhookTransport {
  abstract verifyAndParse(input: PaymentWebhookVerificationInput): Promise<VerifiedPaymentWebhook>;

  static requireVerified(value: unknown): VerifiedPaymentWebhook {
    if (!value || typeof value !== 'object' || !('event' in value) || !('context' in value)) {
      throw new BadRequestException('invalid verified payment webhook');
    }
    return value as VerifiedPaymentWebhook;
  }
}

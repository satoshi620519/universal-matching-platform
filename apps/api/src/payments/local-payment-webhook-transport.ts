import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { PaymentWebhookEvent } from './payment-webhook.js';
import { VerifiedPaymentWebhookTransport, type VerifiedPaymentWebhook } from './payment-webhook-transport.js';

/** Local-only signed transport for integration tests. Production providers must replace this with cryptographic verification. */
@Injectable()
export class LocalPaymentWebhookTransport extends VerifiedPaymentWebhookTransport {
  async verifyAndParse(input: { readonly signature?: string; readonly payload: unknown }): Promise<VerifiedPaymentWebhook> {
    if (input.signature !== 'local-test-signature') throw new UnauthorizedException('invalid payment signature');
    const payload = input.payload as { event?: PaymentWebhookEvent; context?: VerifiedPaymentWebhook['context'] };
    if (!payload?.event || !payload?.context) throw new UnauthorizedException('invalid payment webhook payload');
    return { event: payload.event, context: payload.context };
  }
}

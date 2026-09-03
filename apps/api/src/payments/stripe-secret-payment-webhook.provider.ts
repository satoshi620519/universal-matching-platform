import { Injectable } from '@nestjs/common';
import type { StripeWebhookSecretProvider } from './stripe-payment-webhook-transport.js';

/** Composition-bound secret holder; adapters receive only the capability they need. */
@Injectable()
export class EnvironmentStripeWebhookSecretProvider implements StripeWebhookSecretProvider {
  getSecret(): string | undefined {
    return process.env.STRIPE_WEBHOOK_SECRET;
  }
}

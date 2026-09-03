import { Injectable } from '@nestjs/common';
import { PaymentProvider, type PaymentIntentRequest, type PaymentIntentResult } from './payment-provider.js';

/** Deterministic provider for local development and integration tests; production adapters remain provider-specific. */
@Injectable()
export class InMemoryPaymentProvider extends PaymentProvider {
  private readonly intents = new Map<string, PaymentIntentResult>();

  async createPaymentIntent(input: PaymentIntentRequest): Promise<{ readonly providerReference: string }> {
    const providerReference = `local_${input.intentId}`;
    this.intents.set(providerReference, {
      providerReference,
      status: 'pending',
      amountMinor: input.amountMinor,
      currency: input.currency,
    });
    return { providerReference };
  }

  async getPaymentIntent(providerReference: string): Promise<PaymentIntentResult | null> {
    return this.intents.get(providerReference) ?? null;
  }

  /** Explicit test/development transition; never infer payment success from webhook input. */
  setStatus(providerReference: string, status: PaymentIntentResult['status']): void {
    const current = this.intents.get(providerReference);
    if (!current) throw new Error('payment intent not found');
    this.intents.set(providerReference, { ...current, status });
  }
}

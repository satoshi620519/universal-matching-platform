import { Injectable } from '@nestjs/common';
import { PaymentProvider, type PaymentIntentRequest, type PaymentIntentResult } from './payment-provider.js';

export interface StripeHttpClient {
  request(input: {
    readonly method: 'GET' | 'POST';
    readonly path: string;
    readonly form?: Record<string, string>;
  }): Promise<unknown>;
}

export interface StripePaymentProviderOptions {
  readonly apiVersion?: string;
}

/**
 * Production Stripe adapter. Secrets and HTTP transport stay at composition boundaries.
 * This adapter deliberately maps Stripe payloads into the existing provider-neutral contract.
 */
@Injectable()
export class StripePaymentProvider extends PaymentProvider {
  constructor(
    private readonly client: StripeHttpClient,
    private readonly options: StripePaymentProviderOptions = {},
  ) {
    super();
  }

  async createPaymentIntent(input: PaymentIntentRequest): Promise<{ readonly providerReference: string }> {
    const payload = await this.client.request({
      method: 'POST',
      path: '/v1/payment_intents',
      form: {
        amount: String(input.amountMinor),
        currency: input.currency.toLowerCase(),
        'metadata[intent_id]': input.intentId,
        'metadata[account_id]': input.accountId,
        ...(input.entitlementKey ? { 'metadata[entitlement_key]': input.entitlementKey } : {}),
      },
    });

    const id = this.requireString(payload, 'id');
    return { providerReference: id };
  }

  async getPaymentIntent(providerReference: string): Promise<PaymentIntentResult | null> {
    const payload = await this.client.request({ method: 'GET', path: '/v1/payment_intents/' + encodeURIComponent(providerReference) });
    if (!payload || typeof payload !== 'object') return null;
    const value = payload as Record<string, unknown>;
    const status = this.mapStatus(value.status);
    const amount = value.amount;
    const currency = value.currency;
    const id = value.id;
    if (!status || typeof amount !== 'number' || typeof currency !== 'string' || typeof id !== 'string') return null;
    return { providerReference: id, status, amountMinor: amount, currency: currency.toUpperCase() };
  }

  private mapStatus(value: unknown): PaymentIntentResult['status'] | null {
    switch (value) {
      case 'succeeded': return 'succeeded';
      case 'canceled': return 'cancelled';
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
      case 'processing': return 'pending';
      case 'payment_failed': return 'failed';
      default: return null;
    }
  }

  private requireString(payload: unknown, key: string): string {
    if (!payload || typeof payload !== 'object' || typeof (payload as Record<string, unknown>)[key] !== 'string') {
      throw new Error('invalid Stripe payment intent response');
    }
    return (payload as Record<string, string>)[key];
  }
}

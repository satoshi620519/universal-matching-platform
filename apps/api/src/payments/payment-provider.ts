export type PaymentIntentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled';

export interface PaymentIntentRequest {
  readonly intentId: string;
  readonly accountId: string;
  readonly amountMinor: number;
  readonly currency: string;
  readonly entitlementKey?: string;
  readonly idempotencyKey: string;
}

export interface PaymentIntentResult {
  readonly providerReference: string;
  readonly status: PaymentIntentStatus;
  readonly amountMinor: number;
  readonly currency: string;
}

/** Provider-neutral payment boundary. Provider credentials and SDK details stay outside domain projections. */
export abstract class PaymentProvider {
  abstract createPaymentIntent(
    input: PaymentIntentRequest,
  ): Promise<{ readonly providerReference: string }>;

  abstract getPaymentIntent(
    providerReference: string,
  ): Promise<PaymentIntentResult | null>;
}

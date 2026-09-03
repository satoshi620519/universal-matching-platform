export type PaymentProviderMode = 'local' | 'stripe';

export interface PaymentProviderConfig {
  readonly mode: PaymentProviderMode;
  readonly stripeSecretKey?: string;
  readonly stripeWebhookSecret?: string;
}

export function loadPaymentProviderConfig(
  environment: Record<string, string | undefined> = process.env,
): PaymentProviderConfig {
  const raw = environment.PAYMENT_PROVIDER ?? 'local';
  if (raw !== 'local' && raw !== 'stripe') {
    throw new Error('PAYMENT_PROVIDER must be either local or stripe');
  }

  if (raw === 'stripe') {
    if (!environment.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is required when PAYMENT_PROVIDER=stripe');
    if (!environment.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is required when PAYMENT_PROVIDER=stripe');
    return {
      mode: 'stripe',
      stripeSecretKey: environment.STRIPE_SECRET_KEY,
      stripeWebhookSecret: environment.STRIPE_WEBHOOK_SECRET,
    };
  }

  return { mode: 'local' };
}

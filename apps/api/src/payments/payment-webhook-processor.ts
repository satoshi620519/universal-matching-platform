import { PaymentProvider } from './payment-provider.js';
import { PaymentWebhookHandler, type PaymentWebhookEvent } from './payment-webhook.js';

export interface PaymentEntitlementService {
  grantFromPayment(input: {
    readonly accountId: string;
    readonly intentId: string;
    readonly providerReference: string;
    readonly entitlementKey: string;
  }): Promise<void>;
  revokeFromPayment(input: {
    readonly intentId: string;
    readonly providerReference: string;
  }): Promise<void>;
}

export interface PaymentWebhookContext {
  readonly accountId: string;
  readonly entitlementKey?: string;
}

/** Connects verified payment state to idempotent entitlement effects. */
export class PaymentWebhookProcessor extends PaymentWebhookHandler {
  constructor(
    idempotencyStore: ConstructorParameters<typeof PaymentWebhookHandler>[0],
    private readonly paymentProvider: PaymentProvider,
    private readonly entitlementService: PaymentEntitlementService,
  ) {
    super(idempotencyStore);
  }

  async process(event: PaymentWebhookEvent, context: PaymentWebhookContext): Promise<boolean> {
    if (!(await this.shouldProcess(event))) return false;

    const payment = await this.paymentProvider.getPaymentIntent(event.providerReference);
    if (!payment || payment.providerReference !== event.providerReference) return false;

    if (event.type === 'payment.succeeded' && payment.status === 'succeeded' && context.entitlementKey) {
      await this.entitlementService.grantFromPayment({
        accountId: context.accountId,
        intentId: event.intentId,
        providerReference: event.providerReference,
        entitlementKey: context.entitlementKey,
      });
      return true;
    }

    if ((event.type === 'payment.failed' && payment.status === 'failed') ||
        (event.type === 'payment.cancelled' && payment.status === 'cancelled')) {
      await this.entitlementService.revokeFromPayment({
        intentId: event.intentId,
        providerReference: event.providerReference,
      });
      return true;
    }

    return false;
  }
}

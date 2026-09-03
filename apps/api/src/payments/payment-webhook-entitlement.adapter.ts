import { Injectable } from '@nestjs/common';
import { EntitlementService } from '../entitlements/entitlement.service.js';
import type { PaymentEntitlementService } from './payment-webhook-processor.js';

@Injectable()
export class PaymentWebhookEntitlementAdapter implements PaymentEntitlementService {
  constructor(private readonly entitlements: EntitlementService) {}

  async grantFromPayment(input: { readonly accountId: string; readonly intentId: string; readonly providerReference: string; readonly entitlementKey: string }): Promise<void> {
    await this.entitlements.grant({
      accountId: input.accountId,
      entitlementKey: input.entitlementKey,
      paymentIntentId: input.intentId,
      providerReference: input.providerReference,
    });
  }

  async revokeFromPayment(input: { readonly intentId: string; readonly providerReference: string }): Promise<void> {
    // Revoke only through the explicit payment-intent linkage; never guess an entitlement.
    await this.entitlements.revokeByPaymentIntent(input.intentId);
  }
}

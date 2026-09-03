import { Module } from '@nestjs/common';
import { EntitlementRepository } from '../entitlements/entitlement.repository.js';
import { EntitlementService } from '../entitlements/entitlement.service.js';
import { PrismaEntitlementRepository } from '../entitlements/prisma-entitlement.repository.js';
import { PaymentWebhookEntitlementAdapter } from './payment-webhook-entitlement.adapter.js';
import { PrismaPaymentWebhookIdempotencyStore } from './prisma-payment-webhook-idempotency.store.js';
import { PaymentWebhookIdempotencyStore } from './payment-webhook.js';

@Module({
  providers: [
    PrismaPaymentWebhookIdempotencyStore,
    PaymentWebhookEntitlementAdapter,
    EntitlementService,
    PrismaEntitlementRepository,
    { provide: PaymentWebhookIdempotencyStore, useExisting: PrismaPaymentWebhookIdempotencyStore },
    { provide: EntitlementRepository, useExisting: PrismaEntitlementRepository },
  ],
  exports: [PaymentWebhookIdempotencyStore, PaymentWebhookEntitlementAdapter],
})
export class PaymentWebhookModule {}

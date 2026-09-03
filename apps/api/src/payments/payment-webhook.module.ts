import { Module } from '@nestjs/common';
import { EntitlementRepository } from '../entitlements/entitlement.repository.js';
import { EntitlementService } from '../entitlements/entitlement.service.js';
import { PrismaEntitlementRepository } from '../entitlements/prisma-entitlement.repository.js';
import { InMemoryPaymentProvider } from './in-memory-payment-provider.js';
import { LocalPaymentWebhookTransport } from './local-payment-webhook-transport.js';
import { PaymentProvider } from './payment-provider.js';
import { PaymentWebhookController } from './payment-webhook.controller.js';
import { PaymentWebhookEntitlementAdapter } from './payment-webhook-entitlement.adapter.js';
import { PaymentWebhookProcessor } from './payment-webhook-processor.js';
import { PrismaPaymentWebhookIdempotencyStore } from './prisma-payment-webhook-idempotency.store.js';
import { VerifiedPaymentWebhookTransport } from './payment-webhook-transport.js';
import { PaymentWebhookIdempotencyStore } from './payment-webhook.js';

@Module({
  controllers: [PaymentWebhookController],
  providers: [
    PrismaPaymentWebhookIdempotencyStore,
    InMemoryPaymentProvider,
    LocalPaymentWebhookTransport,
    PaymentWebhookEntitlementAdapter,
    EntitlementService,
    PrismaEntitlementRepository,
    {
      provide: PaymentWebhookProcessor,
      useFactory: (
        idempotency: PaymentWebhookIdempotencyStore,
        provider: PaymentProvider,
        entitlements: PaymentWebhookEntitlementAdapter,
      ) => new PaymentWebhookProcessor(idempotency, provider, entitlements),
      inject: [PaymentWebhookIdempotencyStore, PaymentProvider, PaymentWebhookEntitlementAdapter],
    },
    { provide: PaymentWebhookIdempotencyStore, useExisting: PrismaPaymentWebhookIdempotencyStore },
    { provide: PaymentProvider, useExisting: InMemoryPaymentProvider },
    { provide: VerifiedPaymentWebhookTransport, useExisting: LocalPaymentWebhookTransport },
    { provide: EntitlementRepository, useExisting: PrismaEntitlementRepository },
  ],
  exports: [PaymentWebhookIdempotencyStore, PaymentWebhookEntitlementAdapter, PaymentWebhookProcessor],
})
export class PaymentWebhookModule {}

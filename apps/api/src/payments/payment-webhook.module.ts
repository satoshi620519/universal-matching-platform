import { Module } from '@nestjs/common';
import { EntitlementRepository } from '../entitlements/entitlement.repository.js';
import { EntitlementService } from '../entitlements/entitlement.service.js';
import { PrismaEntitlementRepository } from '../entitlements/prisma-entitlement.repository.js';
import { InMemoryPaymentProvider } from './in-memory-payment-provider.js';
import { FetchStripeHttpClient } from './stripe-http-client.js';
import { StripePaymentProvider, type StripeHttpClient } from './stripe-payment-provider.js';
import { StripePaymentWebhookTransport } from './stripe-payment-webhook-transport.js';
import { EnvironmentStripeWebhookSecretProvider } from './stripe-secret-payment-webhook.provider.js';
import { loadPaymentProviderConfig } from './payment-provider-config.js';
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
    EnvironmentStripeWebhookSecretProvider,
    {
      provide: FetchStripeHttpClient,
      useFactory: () => new FetchStripeHttpClient(loadPaymentProviderConfig().stripeSecretKey ?? ''),
    },
    {
      provide: StripePaymentProvider,
      useFactory: (client: StripeHttpClient) => new StripePaymentProvider(client),
      inject: [FetchStripeHttpClient],
    },
    {
      provide: StripePaymentWebhookTransport,
      useFactory: (secrets: EnvironmentStripeWebhookSecretProvider) => new StripePaymentWebhookTransport(secrets),
      inject: [EnvironmentStripeWebhookSecretProvider],
    },
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
    {
      provide: PaymentProvider,
      useFactory: (local: InMemoryPaymentProvider, stripe: StripePaymentProvider) => loadPaymentProviderConfig().mode === 'stripe' ? stripe : local,
      inject: [InMemoryPaymentProvider, StripePaymentProvider],
    },
    {
      provide: VerifiedPaymentWebhookTransport,
      useFactory: (local: LocalPaymentWebhookTransport, stripe: StripePaymentWebhookTransport) => loadPaymentProviderConfig().mode === 'stripe' ? stripe : local,
      inject: [LocalPaymentWebhookTransport, StripePaymentWebhookTransport],
    },
    { provide: EntitlementRepository, useExisting: PrismaEntitlementRepository },
  ],
  exports: [PaymentWebhookIdempotencyStore, PaymentWebhookEntitlementAdapter, PaymentWebhookProcessor],
})
export class PaymentWebhookModule {}

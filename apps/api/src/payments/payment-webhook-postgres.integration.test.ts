import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DatabaseService } from '../database/database.service.js';
import { PrismaEntitlementRepository } from '../entitlements/prisma-entitlement.repository.js';
import { EntitlementService } from '../entitlements/entitlement.service.js';
import { PrismaPaymentWebhookIdempotencyStore } from './prisma-payment-webhook-idempotency.store.js';

describe.skipIf(!process.env.DATABASE_URL)('payment webhook PostgreSQL integration', () => {
  const database = new DatabaseService();
  const repository = new PrismaEntitlementRepository(database);
  const idempotency = new PrismaPaymentWebhookIdempotencyStore(database);
  const entitlements = new EntitlementService(repository);
  const accountId = randomUUID();

  beforeAll(async () => {
    await database.$connect();
    await database.$executeRawUnsafe(
      "INSERT INTO accounts (id, email, password_hash, status) VALUES ('" + accountId + "', 'm7-" + accountId + "@example.test', 'test', 'active')",
    );
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it('atomically claims duplicate webhook deliveries only once', async () => {
    const eventId = 'evt-pg-' + randomUUID();
    const [first, second] = await Promise.all([idempotency.claim(eventId), idempotency.claim(eventId)]);
    expect([first, second].filter(Boolean)).toHaveLength(1);
  });

  it('revokes only the entitlement explicitly linked to the failed payment intent', async () => {
    const first = await entitlements.grant({ accountId, entitlementKey: 'premium', paymentIntentId: 'intent-pg-a-' + randomUUID(), providerReference: 'ref-a' });
    const second = await entitlements.grant({ accountId, entitlementKey: 'premium', paymentIntentId: 'intent-pg-b-' + randomUUID(), providerReference: 'ref-b' });
    const revoked = await entitlements.revokeByPaymentIntent(first.paymentIntentId!);
    expect(revoked?.id).toBe(first.id);
    expect((await repository.findById(second.id))?.state).toBe('active');
  });
});

import { describe, expect, it, vi } from 'vitest';

import { PrismaPaymentWebhookIdempotencyStore } from './prisma-payment-webhook-idempotency.store.js';

describe('PrismaPaymentWebhookIdempotencyStore', () => {
  it('claims only the first occurrence of an event id', async () => {
    const database = {
      $queryRaw: vi
        .fn()
        .mockResolvedValueOnce([{ claimed: true }])
        .mockResolvedValueOnce([]),
    };
    const store = new PrismaPaymentWebhookIdempotencyStore(database as never);

    await expect(store.claim('evt-1')).resolves.toBe(true);
    await expect(store.claim('evt-1')).resolves.toBe(false);
    expect(database.$queryRaw).toHaveBeenCalledTimes(2);
  });

  it('uses a database-side conflict-safe insert', async () => {
    const database = { $queryRaw: vi.fn().mockResolvedValue([{ claimed: true }]) };
    const store = new PrismaPaymentWebhookIdempotencyStore(database as never);

    await store.claim('evt-1');

    expect(database.$queryRaw).toHaveBeenCalledTimes(1);
  });
});

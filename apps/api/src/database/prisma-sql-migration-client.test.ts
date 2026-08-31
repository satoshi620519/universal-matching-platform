import { describe, expect, it, vi } from 'vitest';

import { PrismaSqlMigrationClient } from './prisma-sql-migration-client.js';

describe('PrismaSqlMigrationClient', () => {
  it('uses the transaction-scoped Prisma client for queries inside transaction', async () => {
    const rootQuery = vi.fn();
    const txQuery = vi.fn().mockResolvedValue(1);
    const $transaction = vi.fn(async (operation) =>
      operation({ $queryRawUnsafe: vi.fn(), $executeRawUnsafe: txQuery }),
    );
    const client = new PrismaSqlMigrationClient({
      $queryRawUnsafe: rootQuery,
      $executeRawUnsafe: vi.fn(),
      $transaction,
    } as any);

    await client.transaction(async (tx) => {
      await tx.query('CREATE TABLE example (id INT)');
    });

    expect(txQuery).toHaveBeenCalledTimes(1);
    expect(rootQuery).not.toHaveBeenCalled();
  });
});

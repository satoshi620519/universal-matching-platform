import { describe, expect, it, vi } from 'vitest';

import { PrismaSqlMigrationClient } from './prisma-sql-migration-client.js';

describe('PrismaSqlMigrationClient', () => {
  it('delegates parameterized reads to the Prisma raw query boundary', async () => {
    const $queryRawUnsafe = vi.fn().mockResolvedValue([{ version: 4 }]);
    const client = new PrismaSqlMigrationClient({
      $queryRawUnsafe,
      $transaction: vi.fn(),
    } as any);

    await expect(
      client.query('SELECT version FROM schema_migrations WHERE version = $1', [4]),
    ).resolves.toEqual([{ version: 4 }]);

    expect($queryRawUnsafe).toHaveBeenCalledWith(
      'SELECT version FROM schema_migrations WHERE version = $1',
      4,
    );
  });

  it('executes the supplied operation through Prisma transaction', async () => {
    const $transaction = vi.fn(async (operation) => operation());
    const client = new PrismaSqlMigrationClient({
      $queryRawUnsafe: vi.fn(),
      $transaction,
    } as any);

    await expect(client.transaction(async () => 'done')).resolves.toBe('done');
    expect($transaction).toHaveBeenCalledTimes(1);
  });
});

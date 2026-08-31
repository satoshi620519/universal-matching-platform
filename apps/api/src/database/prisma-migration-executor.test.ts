import { describe, expect, it, vi } from 'vitest';

import { createPrismaMigrationExecutor } from './prisma-migration-executor.js';

const migration = {
  version: 1,
  filename: '0001_create_accounts.sql',
  sql: 'CREATE TABLE accounts (id UUID PRIMARY KEY)',
};

describe('createPrismaMigrationExecutor', () => {
  it('reads applied migration versions after bootstrapping tracking', async () => {
    const queryRawUnsafe = vi
      .fn()
      .mockResolvedValue([{ version: 2 }, { version: 7 }]);
    const executeRawUnsafe = vi.fn().mockResolvedValue(0);
    const prisma = { executeRawUnsafe, queryRawUnsafe } as never;

    const executor = createPrismaMigrationExecutor(prisma);

    await expect(executor.listAppliedVersions()).resolves.toEqual([2, 7]);
    expect(executeRawUnsafe).toHaveBeenCalledOnce();
    expect(queryRawUnsafe).toHaveBeenCalledWith(
      'SELECT version FROM schema_migrations ORDER BY version ASC',
    );
  });

  it('executes SQL and records the version inside one transaction', async () => {
    const txExecuteRawUnsafe = vi.fn().mockResolvedValue(0);
    const transaction = vi.fn(async (callback: (tx: unknown) => Promise<void>) =>
      callback({ $executeRawUnsafe: txExecuteRawUnsafe }),
    );
    const prisma = { $transaction: transaction } as never;

    const executor = createPrismaMigrationExecutor(prisma);
    await executor.apply(migration);

    expect(transaction).toHaveBeenCalledOnce();
    expect(txExecuteRawUnsafe).toHaveBeenNthCalledWith(1, migration.sql);
    expect(txExecuteRawUnsafe).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO schema_migrations (version) VALUES ($1)',
      1,
    );
  });
});

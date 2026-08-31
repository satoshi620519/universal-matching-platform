import { describe, expect, it } from 'vitest';

import { DatabaseService } from './database.service.js';
import { createMigrationExecutor } from './migration-executor.provider.js';
import { PrismaSqlMigrationClient } from './prisma-sql-migration-client.js';

const DATABASE_URL = process.env.DATABASE_URL;

describe.skipIf(!DATABASE_URL)('Prisma PostgreSQL migration executor', () => {
  it('applies repository migration SQL and records the version from an empty schema_migrations history', async () => {
    const database = new DatabaseService();
    await database.$connect();

    try {
      await database.$executeRawUnsafe('DROP TABLE IF EXISTS migration_executor_probe');
      await database.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');

      const executor = createMigrationExecutor(database);

      await expect(executor.listAppliedVersions()).resolves.toEqual([]);
      await executor.apply({
        version: 1,
        filename: '0001_create_migration_executor_probe.sql',
        sql: 'CREATE TABLE migration_executor_probe (id INTEGER PRIMARY KEY)',
      });

      await expect(executor.listAppliedVersions()).resolves.toEqual([1]);

      const tables = await database.$queryRawUnsafe<Array<{ table_name: string }>>(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'migration_executor_probe'`,
      );
      expect(tables.map(({ table_name }) => table_name)).toEqual([
        'migration_executor_probe',
      ]);
    } finally {
      await database.$executeRawUnsafe('DROP TABLE IF EXISTS migration_executor_probe');
      await database.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      await database.$disconnect();
    }
  });

  it('does not record a version when migration SQL fails inside the transaction', async () => {
    const database = new DatabaseService();
    await database.$connect();

    try {
      await database.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      const executor = createMigrationExecutor(database);

      await expect(
        executor.apply({
          version: 1,
          filename: '0001_failing.sql',
          sql: 'SELECT definitely_missing_function()',
        }),
      ).rejects.toThrow('definitely_missing_function');

      await expect(executor.listAppliedVersions()).resolves.toEqual([]);
    } finally {
      await database.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      await database.$disconnect();
    }
  });
});

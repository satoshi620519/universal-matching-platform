import { describe, expect, it } from 'vitest';

import { PrismaClient } from '@prisma/client';

import { runMigrations } from './migration-runner.js';

const DATABASE_URL = process.env.DATABASE_URL;

const migration = {
  version: 1,
  filename: '0001_create_accounts.sql',
  sql: `
    CREATE TABLE IF NOT EXISTS accounts (
      id UUID PRIMARY KEY,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

const failingMigration = {
  version: 2,
  filename: '0002_failing.sql',
  sql: `
    CREATE TABLE migration_rollback_probe (id UUID PRIMARY KEY);
    SELECT definitely_missing_function();
  `,
};

describe.skipIf(!DATABASE_URL)('PostgreSQL migrations', () => {
  it('applies a migration and makes a second run a no-op', async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS accounts');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');

      await expect(runMigrations(prisma, [migration])).resolves.toEqual([1]);
      await expect(runMigrations(prisma, [migration])).resolves.toEqual([]);

      const tables = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name IN ('accounts', 'schema_migrations')
         ORDER BY table_name`,
      );
      expect(tables.map(({ table_name }) => table_name)).toEqual([
        'accounts',
        'schema_migrations',
      ]);

      const rows = await prisma.$queryRawUnsafe<Array<{ version: number }>>(
        'SELECT version FROM schema_migrations ORDER BY version',
      );
      expect(rows.map(({ version }) => Number(version))).toEqual([1]);
    } finally {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS accounts');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS migration_rollback_probe');
      await prisma.$disconnect();
    }
  });

  it('rolls back migration SQL and tracking when a migration fails', async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS migration_rollback_probe');

      await expect(runMigrations(prisma, [migration])).resolves.toEqual([1]);
      await expect(runMigrations(prisma, [migration, failingMigration])).rejects.toThrow();

      const tables = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'migration_rollback_probe'`,
      );
      expect(tables).toEqual([]);

      const rows = await prisma.$queryRawUnsafe<Array<{ version: number }>>(
        'SELECT version FROM schema_migrations ORDER BY version',
      );
      expect(rows.map(({ version }) => Number(version))).toEqual([1]);
    } finally {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS accounts');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS migration_rollback_probe');
      await prisma.$disconnect();
    }
  });
});

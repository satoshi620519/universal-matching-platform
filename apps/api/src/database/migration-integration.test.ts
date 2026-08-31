import { describe, expect, it } from 'vitest';

import { PrismaClient } from '@prisma/client';

import { runMigrations } from './migration-runner.js';

const DATABASE_URL = process.env.DATABASE_URL;

const accountMigration = {
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

const authenticationIdentityMigration = {
  version: 2,
  filename: '0002_create_authentication_identities.sql',
  sql: `
    CREATE TABLE IF NOT EXISTS authentication_identities (
      id UUID PRIMARY KEY,
      account_id UUID NOT NULL REFERENCES accounts(id),
      provider_type TEXT NOT NULL,
      provider_subject TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider_type, provider_subject)
    )
  `,
};

const failingMigration = {
  version: 3,
  filename: '0003_failing.sql',
  sql: 'SELECT definitely_missing_function()',
};

describe.skipIf(!DATABASE_URL)('PostgreSQL migrations', () => {
  it('applies identity migrations and makes a second run a no-op', async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS authentication_identities');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS accounts');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');

      const migrations = [accountMigration, authenticationIdentityMigration];

      await expect(runMigrations(prisma, migrations)).resolves.toEqual([1, 2]);
      await expect(runMigrations(prisma, migrations)).resolves.toEqual([]);

      const tables = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public'
           AND table_name IN ('accounts', 'authentication_identities', 'schema_migrations')
         ORDER BY table_name`,
      );
      expect(tables.map(({ table_name }) => table_name)).toEqual([
        'accounts',
        'authentication_identities',
        'schema_migrations',
      ]);

      const identityColumns = await prisma.$queryRawUnsafe<
        Array<{ column_name: string }>
      >(
        `SELECT column_name FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'authentication_identities'
         ORDER BY ordinal_position`,
      );
      expect(identityColumns.map(({ column_name }) => column_name)).toEqual([
        'id',
        'account_id',
        'provider_type',
        'provider_subject',
        'status',
        'created_at',
        'updated_at',
      ]);

      const rows = await prisma.$queryRawUnsafe<Array<{ version: number }>>(
        'SELECT version FROM schema_migrations ORDER BY version',
      );
      expect(rows.map(({ version }) => Number(version))).toEqual([1, 2]);
    } finally {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS authentication_identities');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS accounts');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS migration_rollback_probe');
      await prisma.$disconnect();
    }
  });

  it('rolls back a failed migration without recording its version', async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS authentication_identities');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS accounts');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS migration_rollback_probe');

      await expect(
        runMigrations(prisma, [accountMigration, authenticationIdentityMigration]),
      ).resolves.toEqual([1, 2]);
      await expect(runMigrations(prisma, [failingMigration])).rejects.toThrow(
        'definitely_missing_function',
      );

      const rows = await prisma.$queryRawUnsafe<Array<{ version: number }>>(
        'SELECT version FROM schema_migrations ORDER BY version',
      );
      expect(rows.map(({ version }) => Number(version))).toEqual([1, 2]);
    } finally {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS authentication_identities');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS accounts');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS migration_rollback_probe');
      await prisma.$disconnect();
    }
  });
});

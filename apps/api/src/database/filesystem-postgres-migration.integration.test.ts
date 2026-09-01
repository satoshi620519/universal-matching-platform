import { access } from 'node:fs/promises';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  FilesystemMigrationArtifactSource,
  PostgresMigrationExecutor,
  runMigrations,
} from '@universal/database';

import { DatabaseService } from './database.service.js';
import { PrismaSqlMigrationClient } from './prisma-sql-migration-client.js';

const DATABASE_URL = process.env.DATABASE_URL;
const migrationDirectory = join(
  process.cwd(),
  '..',
  '..',
  'packages',
  'database',
  'migrations',
);

describe.skipIf(!DATABASE_URL)(
  'filesystem artifacts through the production PostgreSQL migration path',
  () => {
    it('migrates an empty database from repository SQL files and is idempotent', async () => {
      await expect(access(migrationDirectory)).resolves.toBeUndefined();

      const database = new DatabaseService();
      await database.$connect();

      try {
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS accounts CASCADE');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS password_credentials');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS accounts CASCADE');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS safety_enforcements');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS verification_outcomes');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS verification_requests');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS password_credentials');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS authentication_identities');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS accounts CASCADE');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');

        const source = new FilesystemMigrationArtifactSource(migrationDirectory);
        const executor = new PostgresMigrationExecutor(
          new PrismaSqlMigrationClient(database),
        );

        await expect(runMigrations(source, executor)).resolves.toEqual([1, 2, 3, 4]);
        await expect(runMigrations(source, executor)).resolves.toEqual([]);

        const rows = await database.$queryRawUnsafe<Array<{ version: number }>>(
          'SELECT version FROM schema_migrations ORDER BY version',
        );
        expect(rows.map(({ version }) => Number(version))).toEqual([1, 2, 3, 4]);

        const tables = await database.$queryRawUnsafe<Array<{ table_name: string }>>(
          `SELECT table_name FROM information_schema.tables
           WHERE table_schema = 'public'
             AND table_name IN (
               'accounts',
               'authentication_identities',
               'verification_requests',
               'verification_outcomes',
               'safety_enforcements',
               'schema_migrations'
             )
           ORDER BY table_name`,
        );
        expect(tables.map(({ table_name }) => table_name)).toEqual([
          'accounts',
          'authentication_identities',
          'safety_enforcements',
          'schema_migrations',
          'verification_outcomes',
          'verification_requests',
        ]);
      } finally {
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS safety_enforcements');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS verification_outcomes');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS verification_requests');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS password_credentials');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS authentication_identities');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS accounts CASCADE');
        await database.$executeRawUnsafe('DROP TABLE IF EXISTS schema_migrations');
        await database.$disconnect();
      }
    });
  },
);

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
        await database.$executeRawUnsafe('DROP SCHEMA IF EXISTS public CASCADE');
        await database.$executeRawUnsafe('CREATE SCHEMA public');

        const source = new FilesystemMigrationArtifactSource(migrationDirectory);
        const executor = new PostgresMigrationExecutor(
          new PrismaSqlMigrationClient(database as any),
        );
        const expectedMigrations = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

        await expect(runMigrations(source, executor)).resolves.toEqual(expectedMigrations);
        await expect(runMigrations(source, executor)).resolves.toEqual([]);

        const rows = await database.$queryRawUnsafe<Array<{ version: number }>>(
          'SELECT version FROM schema_migrations ORDER BY version',
        );
        expect(rows.map(({ version }) => Number(version))).toEqual(expectedMigrations);

        const tables = await database.$queryRawUnsafe<Array<{ table_name: string }>>(
          `SELECT table_name FROM information_schema.tables
           WHERE table_schema = 'public'
             AND table_name IN (
               'accounts',
               'authentication_identities',
               'verification_requests',
               'verification_outcomes',
               'safety_enforcements',
               'safety_reports',
               'moderation_cases',
               'schema_migrations'
             )
           ORDER BY table_name`,
        );
        expect(tables.map(({ table_name }) => table_name)).toEqual([
          'accounts',
          'authentication_identities',
          'moderation_cases',
          'safety_enforcements',
          'safety_reports',
          'schema_migrations',
          'verification_outcomes',
          'verification_requests',
        ]);
      } finally {
        await database.$executeRawUnsafe('DROP SCHEMA IF EXISTS public CASCADE');
        await database.$executeRawUnsafe('CREATE SCHEMA public');
        await database.$disconnect();
      }
    });
  },
);

import { Client } from 'pg';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FilesystemMigrationArtifactSource, PostgresMigrationExecutor, runMigrations } from '../dist/index.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required to run database migrations');

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDirectory = join(packageRoot, 'dist', 'migrations');
const client = new Client({ connectionString: databaseUrl });
await client.connect();
try {
  const applied = await runMigrations(
    new FilesystemMigrationArtifactSource(migrationsDirectory),
    new PostgresMigrationExecutor({
      query: (sql, params) => client.query(sql, params),
      transaction: async (operation) => {
        await client.query('BEGIN');
        try {
          const result = await operation({ query: (sql, params) => client.query(sql, params) });
          await client.query('COMMIT');
          return result;
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }
      },
    }),
  );
  console.log('Applied migrations: ' + (applied.length ? applied.join(', ') : 'none'));
} finally {
  await client.end();
}

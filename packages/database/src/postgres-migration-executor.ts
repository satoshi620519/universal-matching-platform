import type { MigrationExecutor } from './executor.js';
import type { MigrationArtifact } from './migrations.js';

export interface SqlMigrationQueryClient {
  query<T = unknown>(sql: string, params?: readonly unknown[]): Promise<T>;
}

export interface SqlMigrationClient extends SqlMigrationQueryClient {
  transaction<T>(operation: (tx: SqlMigrationQueryClient) => Promise<T>): Promise<T>;
}

export class PostgresMigrationExecutor implements MigrationExecutor {
  constructor(private readonly client: SqlMigrationClient) {}

  async listAppliedVersions(): Promise<readonly number[]> {
    await this.client.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    );

    const result = await this.client.query<readonly { version: number }[]>(
      'SELECT version FROM schema_migrations ORDER BY version ASC',
    );

    return result.map((row) => row.version);
  }

  async apply(migration: MigrationArtifact): Promise<void> {
    await this.client.transaction(async (tx) => {
      for (const statement of migration.sql.split(';').map((value) => value.trim()).filter(Boolean)) {
        await tx.query(statement);
      }
      await tx.query(
        'INSERT INTO schema_migrations (version) VALUES ($1)',
        [migration.version],
      );
    });
  }
}

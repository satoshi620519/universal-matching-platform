import type { MigrationExecutor } from './executor.js';
import type { MigrationArtifact } from './migrations.js';

export interface SqlMigrationQueryClient {
  query<T = unknown>(sql: string, params?: readonly unknown[]): Promise<T>;
}

interface SqlQueryResult<Row = unknown> {
  rows: readonly Row[];
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

    const result = await this.client.query<SqlQueryResult<{ version: number }>>(
      'SELECT version FROM schema_migrations ORDER BY version ASC',
    );

    return result.rows.map((row) => row.version);
  }

  async apply(migration: MigrationArtifact): Promise<void> {
    await this.client.transaction(async (tx) => {
      // PostgreSQL SQL may legally contain semicolons inside function bodies, strings,
      // comments, or dollar-quoted blocks. Do not implement an incomplete SQL parser here;
      // send the immutable migration artifact to the PostgreSQL driver as authored.
      if (migration.sql.trim()) await tx.query(migration.sql);
      await tx.query(
        'INSERT INTO schema_migrations (version) VALUES ($1)',
        [migration.version],
      );
    });
  }
}

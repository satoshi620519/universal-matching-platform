import type { MigrationExecutor } from './executor.js';
import type { MigrationArtifact } from './migrations.js';

export interface SqlMigrationClient {
  query<T = unknown>(sql: string, params?: readonly unknown[]): Promise<T>;
  transaction<T>(operation: () => Promise<T>): Promise<T>;
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
    await this.client.transaction(async () => {
      await this.client.query(migration.sql);
      await this.client.query(
        'INSERT INTO schema_migrations (version) VALUES ($1)',
        [migration.version],
      );
    });
  }
}

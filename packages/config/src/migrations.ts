export interface MigrationConfig {
  readonly directory: string;
  readonly tableName: string;
}

export const defaultMigrationConfig: MigrationConfig = {
  directory: 'packages/database/migrations',
  tableName: 'schema_migrations',
};

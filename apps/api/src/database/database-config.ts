export interface DatabaseConfig {
  readonly url: string;
}

export function requireDatabaseConfig(
  databaseUrl: string | undefined,
): DatabaseConfig {
  if (!databaseUrl || databaseUrl.trim().length === 0) {
    throw new Error('DATABASE_URL is required for database operations');
  }

  return { url: databaseUrl };
}

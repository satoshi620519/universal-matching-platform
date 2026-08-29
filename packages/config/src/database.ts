export interface DatabaseConfig {
  readonly url: string;
  readonly poolSize: number;
}

export function createDatabaseConfig(env: NodeJS.ProcessEnv): DatabaseConfig {
  const url = env.DATABASE_URL?.trim();
  if (!url) throw new Error('DATABASE_URL is required');

  const poolSize = Number(env.DATABASE_POOL_SIZE ?? 10);
  if (!Number.isInteger(poolSize) || poolSize < 1) {
    throw new Error('DATABASE_POOL_SIZE must be a positive integer');
  }

  return { url, poolSize };
}

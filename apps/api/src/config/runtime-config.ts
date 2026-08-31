export interface RuntimeConfig {
  readonly port: number;
  readonly host: string;
  readonly environment: string;
  readonly databaseUrl?: string;
}

export function loadRuntimeConfig(
  environment: Record<string, string | undefined> = process.env,
): RuntimeConfig {
  const rawPort = environment.PORT ?? '3001';
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  const environmentName = environment.NODE_ENV ?? 'development';

  return {
    port,
    host: environment.HOST ?? '0.0.0.0',
    environment: environmentName,
    databaseUrl: environment.DATABASE_URL,
  };
}

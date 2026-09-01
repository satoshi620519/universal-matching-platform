import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

if (!process.env.MATCHING_TEST_DATABASE_URL) {
  console.error('MATCHING_TEST_DATABASE_URL must point to an isolated PostgreSQL database');
  process.exit(1);
}

const databaseUrl = process.env.MATCHING_TEST_DATABASE_URL;

execSync('pnpm --filter @universal/database build', { stdio: 'inherit' });
execSync('pnpm prisma generate', { stdio: 'inherit' });

const { PrismaClient } = await import('@prisma/client');
const {
  FilesystemMigrationArtifactSource,
  PostgresMigrationExecutor,
  runMigrations,
} = await import('../../../packages/database/dist/index.js');

const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

const executeStatements = async (client, sql, params = []) => {
  if (params.length > 0) {
    return client.$queryRawUnsafe(sql, ...params);
  }

  let lastResult = [];
  for (const statement of sql.split(';').map((value) => value.trim()).filter(Boolean)) {
    lastResult = await client.$queryRawUnsafe(statement);
  }
  return lastResult;
};

const sqlClient = {
  query: (sql, params = []) => executeStatements(prisma, sql, params),
  transaction: (operation) =>
    prisma.$transaction(async (tx) =>
      operation({
        query: (sql, params = []) => executeStatements(tx, sql, params),
      }),
    ),
};

try {
  const source = new FilesystemMigrationArtifactSource(
    resolve(process.cwd(), '../../packages/database/migrations'),
  );
  const executor = new PostgresMigrationExecutor(sqlClient);
  const appliedVersions = await runMigrations(source, executor);
  console.log(
    `Applied database migrations: ${appliedVersions.length > 0 ? appliedVersions.join(', ') : 'none'}`,
  );

  execSync('pnpm prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  execSync('pnpm vitest run src/matching/prisma-match-transition.repository.integration.test.ts', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
} finally {
  await prisma.$disconnect();
}

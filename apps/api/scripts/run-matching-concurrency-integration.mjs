import { execSync } from 'node:child_process';

if (!process.env.MATCHING_TEST_DATABASE_URL) {
  console.error('MATCHING_TEST_DATABASE_URL must point to an isolated PostgreSQL database');
  process.exit(1);
}

execSync('pnpm prisma generate', { stdio: 'inherit' });
execSync('pnpm prisma migrate deploy', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: process.env.MATCHING_TEST_DATABASE_URL } });
execSync('pnpm vitest run src/matching/prisma-match-transition.repository.integration.test.ts', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: process.env.MATCHING_TEST_DATABASE_URL },
});

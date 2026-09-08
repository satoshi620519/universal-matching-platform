import 'reflect-metadata';

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { requireDemoEnvironment } from './demo-environment-guard.js';
import { runDemoSeed } from './demo-seed.main.js';

const execFileAsync = promisify(execFile);

export function assertDemoResetEnvironment(
  environment: Record<string, string | undefined> = process.env,
): void {
  requireDemoEnvironment(environment);
}

export async function runDemoReset(): Promise<void> {
  assertDemoResetEnvironment();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required for demo reset');

  const resetMarker = process.env.DEMO_DATABASE_RESET_APPROVED;
  if (resetMarker !== 'true') {
    throw new Error('Demo reset is refused unless DEMO_DATABASE_RESET_APPROVED=true is explicitly set');
  }

  await execFileAsync(
    'pnpm',
    ['--filter', '@universal/database', 'migrate'],
    {
      env: process.env,
      stdio: 'inherit',
    },
  );

  await runDemoSeed();
}

if (process.env.VITEST !== 'true') {
  void runDemoReset();
}

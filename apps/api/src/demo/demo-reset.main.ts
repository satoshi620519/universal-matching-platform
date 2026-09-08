import 'reflect-metadata';

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { requireDemoEnvironment } from './demo-environment-guard.js';
import { DemoDatabaseResetService } from './demo-database-reset.service.js';
import { DemoSeedService } from './demo-seed.service.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';

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

  await execFileAsync('pnpm', ['--filter', '@universal/database', 'migrate'], {
    env: process.env,
  });

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    await app.get(DemoDatabaseResetService).clear();
    await app.get(DemoSeedService).seed();
  } finally {
    await app.close();
  }
}

if (process.env.VITEST !== 'true') {
  void runDemoReset();
}

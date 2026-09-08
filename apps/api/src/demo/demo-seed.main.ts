import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module.js';
import { DemoSeedService } from './demo-seed.service.js';
import { requireDemoEnvironment } from './demo-environment-guard.js';

export async function runDemoSeed(): Promise<void> {
  requireDemoEnvironment();

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    await app.get(DemoSeedService).seed();
    console.log('fictional demo baseline seeded');
  } finally {
    await app.close();
  }
}

if (process.env.VITEST !== 'true') {
  void runDemoSeed();
}

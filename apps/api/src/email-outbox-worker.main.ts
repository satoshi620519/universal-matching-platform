import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { EmailOutboxProcessService } from './auth/email-outbox-process.service.js';

const batchSize = Number.parseInt(process.env.EMAIL_OUTBOX_BATCH_SIZE ?? '100', 10);

async function main(): Promise<void> {
  if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 1000) {
    throw new Error('EMAIL_OUTBOX_BATCH_SIZE must be an integer between 1 and 1000');
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    await app.get(EmailOutboxProcessService).runBatch(batchSize);
  } finally {
    await app.close();
  }
}

void main();

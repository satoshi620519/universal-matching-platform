import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module.js';
import { InitialAdministratorProvisioningService } from './initial-administrator-provisioning.service.js';

export function parseAccountId(argv: readonly string[]): string {
  const accountId = argv[2]?.trim();
  if (!accountId) {
    throw new Error('usage: pnpm --filter @universal/api administrator:provision <accountId>');
  }
  if (argv.length > 3) {
    throw new Error('administrator provisioning accepts exactly one accountId');
  }
  return accountId;
}

async function main(): Promise<void> {
  const accountId = parseAccountId(process.argv);
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    const created = await app
      .get(InitialAdministratorProvisioningService)
      .provision(accountId);

    if (created) {
      console.log(`initial administrator provisioned for account ${accountId}`);
    } else {
      console.log(`administrator already active for account ${accountId}; no change made`);
    }
  } finally {
    await app.close();
  }
}

void main();

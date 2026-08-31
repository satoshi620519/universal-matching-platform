import type { MigrationArtifact } from '@universal/database';
import { executePendingMigrations } from '@universal/database';
import { PrismaClient } from '@prisma/client';

import { createPrismaMigrationExecutor } from './prisma-migration-executor.js';

export async function runMigrations(
  prisma: PrismaClient,
  migrations: readonly MigrationArtifact[],
): Promise<readonly number[]> {
  return executePendingMigrations(
    migrations,
    createPrismaMigrationExecutor(prisma),
  );
}

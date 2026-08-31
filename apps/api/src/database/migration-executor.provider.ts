import { PostgresMigrationExecutor } from '@universal/database';

import { DatabaseService } from './database.service.js';
import { PrismaSqlMigrationClient } from './prisma-sql-migration-client.js';

export const MIGRATION_EXECUTOR = Symbol('MIGRATION_EXECUTOR');

export function createMigrationExecutor(
  database: DatabaseService,
): PostgresMigrationExecutor {
  return new PostgresMigrationExecutor(new PrismaSqlMigrationClient(database));
}

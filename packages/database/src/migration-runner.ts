import type { MigrationExecutor } from './executor.js';
import { executePendingMigrations } from './executor.js';
import type { MigrationArtifactSource } from './migration-source.js';

export async function runMigrations(
  source: MigrationArtifactSource,
  executor: MigrationExecutor,
): Promise<readonly number[]> {
  return executePendingMigrations(await source.load(), executor);
}

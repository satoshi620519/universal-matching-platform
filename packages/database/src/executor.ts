import type { MigrationArtifact } from './migrations.js';
import { planMigrations } from './migrations.js';

export interface MigrationExecutor {
  readonly listAppliedVersions: () => Promise<readonly number[]>;
  /** Applies the migration SQL and records its version atomically. */
  readonly apply: (migration: MigrationArtifact) => Promise<void>;
}

export async function executePendingMigrations(
  migrations: readonly MigrationArtifact[],
  executor: MigrationExecutor,
): Promise<readonly number[]> {
  const appliedVersions = await executor.listAppliedVersions();
  const uniqueAppliedVersions = new Set(appliedVersions);
  if (uniqueAppliedVersions.size !== appliedVersions.length) {
    throw new Error('Migration history contains duplicate applied versions');
  }
  const plan = planMigrations(migrations, uniqueAppliedVersions);

  const applied: number[] = [];
  for (const migration of plan.pending) {
    await executor.apply(migration);
    applied.push(migration.version);
  }

  return applied;
}

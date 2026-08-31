import { describe, expect, it } from 'vitest';

import { executePendingMigrations } from './executor.js';
import type { MigrationArtifact } from './migrations.js';

const migrations: readonly MigrationArtifact[] = [
  { version: 2, filename: '0002_add_status.sql', sql: 'status' },
  { version: 1, filename: '0001_create_accounts.sql', sql: 'accounts' },
];

describe('executePendingMigrations', () => {
  it('applies only pending migrations in version order', async () => {
    const applied: number[] = [];

    const result = await executePendingMigrations(migrations, {
      listAppliedVersions: async () => [1],
      apply: async (migration) => {
        applied.push(migration.version);
      },
    });

    expect(applied).toEqual([2]);
    expect(result).toEqual([2]);
  });

  it('stops when a migration fails', async () => {
    const applied: number[] = [];

    await expect(
      executePendingMigrations(migrations, {
        listAppliedVersions: async () => [],
        apply: async (migration) => {
          applied.push(migration.version);
          if (migration.version === 1) {
            throw new Error('migration failed');
          }
        },
      }),
    ).rejects.toThrow('migration failed');

    expect(applied).toEqual([1]);
  });
});

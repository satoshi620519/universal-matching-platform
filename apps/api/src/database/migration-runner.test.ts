import { describe, expect, it, vi } from 'vitest';

import { runMigrations } from './migration-runner.js';

vi.mock('@universal/database', () => ({
  executePendingMigrations: vi.fn().mockResolvedValue([1]),
}));

vi.mock('./prisma-migration-executor.js', () => ({
  createPrismaMigrationExecutor: vi.fn().mockReturnValue({}),
}));

describe('runMigrations', () => {
  it('delegates migration execution to the database package', async () => {
    const { executePendingMigrations } = await import('@universal/database');
    const { createPrismaMigrationExecutor } = await import('./prisma-migration-executor.js');
    const prisma = {} as never;
    const migrations = [
      { version: 1, filename: '0001_create_accounts.sql', sql: 'CREATE TABLE accounts (...)' },
    ];

    await expect(runMigrations(prisma, migrations)).resolves.toEqual([1]);
    expect(createPrismaMigrationExecutor).toHaveBeenCalledWith(prisma);
    expect(executePendingMigrations).toHaveBeenCalledWith(
      migrations,
      expect.any(Object),
    );
  });
});

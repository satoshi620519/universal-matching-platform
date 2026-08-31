import { describe, expect, it, vi } from 'vitest';

import { PostgresMigrationExecutor } from './postgres-migration-executor.js';

describe('PostgresMigrationExecutor', () => {
  it('initializes tracking and returns ordered applied versions', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce([{ version: 1 }, { version: 4 }]);
    const client = { query, transaction: vi.fn() };
    const executor = new PostgresMigrationExecutor(client as any);

    await expect(executor.listAppliedVersions()).resolves.toEqual([1, 4]);
  });

  it('applies SQL and records the version inside one transaction', async () => {
    const events: string[] = [];
    const client = {
      query: vi.fn(async (sql: string) => {
        events.push(sql);
      }),
      transaction: vi.fn(async (operation: () => Promise<void>) => operation()),
    };
    const executor = new PostgresMigrationExecutor(client);

    await executor.apply({
      version: 4,
      filename: '0004_create_safety_enforcements.sql',
      sql: 'CREATE TABLE safety_enforcements ();',
    });

    expect(client.transaction).toHaveBeenCalledTimes(1);
    expect(events).toEqual([
      'CREATE TABLE safety_enforcements ();',
      'INSERT INTO schema_migrations (version) VALUES ($1)',
    ]);
    expect(client.query).toHaveBeenLastCalledWith(
      'INSERT INTO schema_migrations (version) VALUES ($1)',
      [4],
    );
  });
});

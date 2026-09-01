import { describe, expect, it, vi } from 'vitest';

import {
  PostgresMigrationExecutor,
  type SqlMigrationClient,
  type SqlMigrationQueryClient,
} from './postgres-migration-executor.js';

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

  it('propagates tracking initialization failures without attempting the history query', async () => {
    const query = vi.fn().mockRejectedValueOnce(new Error('tracking unavailable'));
    const client: SqlMigrationClient = { query, transaction: vi.fn() };
    const executor = new PostgresMigrationExecutor(client);

    await expect(executor.listAppliedVersions()).rejects.toThrow('tracking unavailable');
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('propagates migration SQL failures and does not record the version', async () => {
    const rootQuery: SqlMigrationQueryClient['query'] = vi.fn();
    const txQuery = vi
      .fn()
      .mockRejectedValueOnce(new Error('migration SQL failed'));
    const client: SqlMigrationClient = {
      query: rootQuery,
      transaction: async <T>(operation: (tx: SqlMigrationQueryClient) => Promise<T>) =>
        operation({ query: txQuery }),
    };
    const executor = new PostgresMigrationExecutor(client);

    await expect(
      executor.apply({ version: 5, filename: '0005_failed.sql', sql: 'BROKEN SQL' }),
    ).rejects.toThrow('migration SQL failed');
    expect(txQuery).toHaveBeenCalledTimes(1);
    expect(rootQuery).not.toHaveBeenCalled();
  });

  it('applies SQL and records the version through the transaction-scoped client', async () => {
    const events: string[] = [];
    const rootQuery: SqlMigrationQueryClient['query'] = vi.fn(
      async <T = unknown>(_sql: string, _params?: readonly unknown[]): Promise<T> =>
        undefined as T,
    );
    const txQuery = vi.fn(
      async <T = unknown>(sql: string, _params?: readonly unknown[]): Promise<T> => {
        events.push(sql);
        return undefined as T;
      },
    );
    const client: SqlMigrationClient = {
      query: rootQuery,
      transaction: async <T>(
        operation: (tx: SqlMigrationQueryClient) => Promise<T>,
      ) => operation({ query: txQuery }),
    };
    const executor = new PostgresMigrationExecutor(client);

    await executor.apply({
      version: 4,
      filename: '0004_create_safety_enforcements.sql',
      sql: 'CREATE TABLE safety_enforcements ();',
    });

    expect(events).toEqual([
      'CREATE TABLE safety_enforcements ();',
      'INSERT INTO schema_migrations (version) VALUES ($1)',
    ]);
    expect(rootQuery).not.toHaveBeenCalled();
    expect(txQuery).toHaveBeenLastCalledWith(
      'INSERT INTO schema_migrations (version) VALUES ($1)',
      [4],
    );
  });
});

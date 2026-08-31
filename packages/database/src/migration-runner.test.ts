import { describe, expect, it, vi } from 'vitest';

import { runMigrations } from './migration-runner.js';

describe('runMigrations', () => {
  it('loads artifacts before executing pending migrations', async () => {
    const source = {
      load: vi.fn().mockResolvedValue([
        { version: 1, filename: '0001_create_accounts.sql', sql: 'CREATE TABLE accounts ();' },
      ]),
    };
    const executor = {
      listAppliedVersions: vi.fn().mockResolvedValue([]),
      apply: vi.fn().mockResolvedValue(undefined),
    };

    await expect(runMigrations(source, executor)).resolves.toEqual([1]);
    expect(source.load).toHaveBeenCalledTimes(1);
    expect(executor.apply).toHaveBeenCalledTimes(1);
  });
});

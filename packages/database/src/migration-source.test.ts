import { describe, expect, it } from 'vitest';

import { StaticMigrationArtifactSource } from './migration-source.js';

describe('StaticMigrationArtifactSource', () => {
  it('returns the configured immutable migration artifacts', async () => {
    const migrations = [
      { version: 1, filename: '0001_create_accounts.sql', sql: 'CREATE TABLE accounts ();' },
    ] as const;
    const source = new StaticMigrationArtifactSource(migrations);

    await expect(source.load()).resolves.toEqual(migrations);
  });
});

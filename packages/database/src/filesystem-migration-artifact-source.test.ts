import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { FilesystemMigrationArtifactSource } from './filesystem-migration-artifact-source.js';

describe('FilesystemMigrationArtifactSource', () => {
  it('loads ordered SQL migration artifacts from an explicit directory', async () => {
    const directory = join(tmpdir(), `migration-source-${randomUUID()}`);
    await mkdir(directory);
    await writeFile(join(directory, '0002_second.sql'), 'SELECT 2;');
    await writeFile(join(directory, '0001_first.sql'), 'SELECT 1;');

    const source = new FilesystemMigrationArtifactSource(directory);

    await expect(source.load()).resolves.toEqual([
      { version: 1, filename: '0001_first.sql', sql: 'SELECT 1;' },
      { version: 2, filename: '0002_second.sql', sql: 'SELECT 2;' },
    ]);
  });

  it('ignores nested directories while loading regular migration files', async () => {
    const directory = join(tmpdir(), `migration-source-${randomUUID()}`);
    await mkdir(directory);
    await mkdir(join(directory, 'archive'));
    await writeFile(join(directory, '0001_first.sql'), 'SELECT 1;');
    await writeFile(join(directory, 'archive', 'notes.txt'), 'not a migration');

    const source = new FilesystemMigrationArtifactSource(directory);

    await expect(source.load()).resolves.toEqual([
      { version: 1, filename: '0001_first.sql', sql: 'SELECT 1;' },
    ]);
  });

  it('rejects regular files that violate the migration filename contract', async () => {
    const directory = join(tmpdir(), `migration-source-${randomUUID()}`);
    await mkdir(directory);
    await writeFile(join(directory, '0001_first.sql'), 'SELECT 1;');
    await writeFile(join(directory, 'notes.txt'), 'not a migration');

    const source = new FilesystemMigrationArtifactSource(directory);

    await expect(source.load()).rejects.toThrow();
  });
});

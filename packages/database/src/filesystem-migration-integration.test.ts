import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';

import { describe, expect, it, vi } from 'vitest';

import type { MigrationArtifact } from './migrations.js';
import { FilesystemMigrationArtifactSource } from './filesystem-migration-artifact-source.js';
import { runMigrations } from './migration-runner.js';

describe('filesystem migration integration', () => {
  it('loads an ordered filesystem artifact set and executes it against an empty migration history', async () => {
    const directory = join(tmpdir(), `migration-integration-${randomUUID()}`);
    await mkdir(directory);
    await writeFile(join(directory, '0002_second.sql'), 'CREATE TABLE second ();');
    await writeFile(join(directory, '0001_first.sql'), 'CREATE TABLE first ();');

    const applied: number[] = [];
    const executor = {
      listAppliedVersions: vi.fn().mockResolvedValue([]),
      apply: vi.fn(async (migration: MigrationArtifact) => {
        applied.push(migration.version);
      }),
    };

    const source = new FilesystemMigrationArtifactSource(directory);

    await expect(runMigrations(source, executor)).resolves.toEqual([1, 2]);
    expect(applied).toEqual([1, 2]);
    expect(executor.apply).toHaveBeenCalledTimes(2);
  });

  it('is idempotent after the filesystem artifact set has been fully applied', async () => {
    const directory = join(tmpdir(), `migration-integration-${randomUUID()}`);
    await mkdir(directory);
    await writeFile(join(directory, '0001_first.sql'), 'CREATE TABLE first ();');

    const applied: number[] = [];
    const executor = {
      listAppliedVersions: vi.fn().mockResolvedValue([1]),
      apply: vi.fn(async (migration: MigrationArtifact) => {
        applied.push(migration.version);
      }),
    };

    const source = new FilesystemMigrationArtifactSource(directory);

    await expect(runMigrations(source, executor)).resolves.toEqual([]);
    expect(applied).toEqual([]);
    expect(executor.apply).not.toHaveBeenCalled();
  });
});

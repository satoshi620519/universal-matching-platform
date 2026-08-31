import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import {
  assertValidMigrationPlan,
  parseMigrationFilename,
  type MigrationArtifact,
} from './migrations.js';
import type { MigrationArtifactSource } from './migration-source.js';

export class FilesystemMigrationArtifactSource
  implements MigrationArtifactSource
{
  constructor(private readonly directory: string) {}

  async load(): Promise<readonly MigrationArtifact[]> {
    const entries = await readdir(this.directory, { withFileTypes: true });
    const filenames = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));

    const migrations = await Promise.all(
      filenames.map(async (filename) => {
        const parsed = parseMigrationFilename(filename);
        return {
          version: parsed.version,
          filename,
          sql: await readFile(join(this.directory, filename), 'utf8'),
        };
      }),
    );

    return assertValidMigrationPlan(migrations);
  }
}

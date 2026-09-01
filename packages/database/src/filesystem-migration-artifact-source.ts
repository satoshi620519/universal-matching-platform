import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import {
  orderMigrationFilenames,
  parseMigrationFilename,
  validateMigrationArtifacts,
  type MigrationArtifact,
} from './migrations.js';
import type { MigrationArtifactSource } from './migration-source.js';

export class FilesystemMigrationArtifactSource
  implements MigrationArtifactSource
{
  constructor(private readonly directory: string) {}

  async load(): Promise<readonly MigrationArtifact[]> {
    const entries = await readdir(this.directory, { withFileTypes: true });
    const filenames = orderMigrationFilenames(
      entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name),
    );

    const migrations = await Promise.all(
      filenames.map(async (filename) => {
        const version = parseMigrationFilename(filename);
        return {
          version,
          filename,
          sql: await readFile(join(this.directory, filename), 'utf8'),
        };
      }),
    );

    return validateMigrationArtifacts(migrations);
  }
}

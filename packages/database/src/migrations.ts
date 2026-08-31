export interface MigrationArtifact {
  readonly version: number;
  readonly filename: string;
  readonly sql: string;
}

export interface MigrationPlan {
  readonly pending: readonly MigrationArtifact[];
}

const MIGRATION_FILENAME = /^(\d{4})_[a-z0-9][a-z0-9_-]*\.sql$/;

export function parseMigrationFilename(filename: string): number {
  const match = MIGRATION_FILENAME.exec(filename);
  if (!match) {
    throw new Error(`Invalid migration filename: ${filename}`);
  }

  const version = Number(match[1]);
  if (version <= 0) {
    throw new Error(`Migration version must be positive: ${filename}`);
  }

  return version;
}

export function orderMigrationFilenames(filenames: readonly string[]): string[] {
  const parsed = filenames.map((filename) => ({
    filename,
    version: parseMigrationFilename(filename),
  }));

  const versions = new Set<number>();
  for (const migration of parsed) {
    if (versions.has(migration.version)) {
      throw new Error(`Duplicate migration version: ${migration.version}`);
    }
    versions.add(migration.version);
  }

  return parsed
    .sort((left, right) => left.version - right.version)
    .map((migration) => migration.filename);
}

export function validateMigrationArtifacts(
  migrations: readonly MigrationArtifact[],
): MigrationArtifact[] {
  const versions = new Set<number>();
  for (const migration of migrations) {
    const filenameVersion = parseMigrationFilename(migration.filename);
    if (filenameVersion !== migration.version) {
      throw new Error(
        `Migration version does not match filename: ${migration.filename}`,
      );
    }
    if (versions.has(migration.version)) {
      throw new Error(`Duplicate migration version: ${migration.version}`);
    }
    versions.add(migration.version);
  }

  return [...migrations].sort((left, right) => left.version - right.version);
}

export function planMigrations(
  migrations: readonly MigrationArtifact[],
  appliedVersions: ReadonlySet<number>,
): MigrationPlan {
  const ordered = validateMigrationArtifacts(migrations);

  return {
    pending: ordered.filter((migration) => !appliedVersions.has(migration.version)),
  };
}

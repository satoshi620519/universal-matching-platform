import type { MigrationArtifact } from './migrations.js';

export interface MigrationArtifactSource {
  load(): Promise<readonly MigrationArtifact[]>;
}

export class StaticMigrationArtifactSource implements MigrationArtifactSource {
  constructor(private readonly migrations: readonly MigrationArtifact[]) {}

  async load(): Promise<readonly MigrationArtifact[]> {
    return this.migrations;
  }
}

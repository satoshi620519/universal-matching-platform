import type { MigrationArtifact, MigrationExecutor } from '@universal/database';
import { PrismaClient } from '@prisma/client';

const SCHEMA_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export function createPrismaMigrationExecutor(
  prisma: PrismaClient,
): MigrationExecutor {
  return {
    async listAppliedVersions(): Promise<readonly number[]> {
      await prisma.$executeRawUnsafe(SCHEMA_MIGRATIONS_TABLE);
      const rows = await prisma.$queryRawUnsafe<Array<{ version: number }>>(
        'SELECT version FROM schema_migrations ORDER BY version ASC',
      );
      return rows.map((row) => Number(row.version));
    },

    async apply(migration: MigrationArtifact): Promise<void> {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(migration.sql);
        await tx.$executeRawUnsafe(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          migration.version,
        );
      });
    },
  };
}

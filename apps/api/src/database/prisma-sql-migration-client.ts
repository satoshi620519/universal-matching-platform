import type { PrismaClient } from '@prisma/client';
import type { SqlMigrationClient } from '@universal/database';

export class PrismaSqlMigrationClient implements SqlMigrationClient {
  constructor(private readonly prisma: PrismaClient) {}

  async query<T = unknown>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<T> {
    return this.prisma.$queryRawUnsafe(sql, ...params) as Promise<T>;
  }

  async transaction<T>(operation: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async () => operation());
  }
}

import type { PrismaClient } from '@prisma/client';
import type {
  SqlMigrationClient,
  SqlMigrationQueryClient,
} from '@universal/database';

type RawSqlClient = Pick<PrismaClient, '$queryRawUnsafe' | '$executeRawUnsafe'>;

class PrismaSqlMigrationQueryClient implements SqlMigrationQueryClient {
  constructor(private readonly client: RawSqlClient) {}

  async query<T = unknown>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<T> {
    const trimmed = sql.trimStart().toUpperCase();
    if (trimmed.startsWith('SELECT')) {
      return this.client.$queryRawUnsafe<T>(sql, ...params);
    }

    return this.client.$executeRawUnsafe(sql, ...params) as Promise<T>;
  }
}

export class PrismaSqlMigrationClient
  extends PrismaSqlMigrationQueryClient
  implements SqlMigrationClient
{
  constructor(private readonly prisma: PrismaClient) {
    super(prisma);
  }

  async transaction<T>(
    operation: (tx: SqlMigrationQueryClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) =>
      operation(new PrismaSqlMigrationQueryClient(tx)),
    );
  }
}

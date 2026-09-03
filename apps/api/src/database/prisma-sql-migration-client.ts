import type { PrismaClient } from '@prisma/client';
import type {
  SqlMigrationClient,
  SqlMigrationQueryClient,
} from '@universal/database';

type RawSqlClient = Pick<PrismaClient, '$queryRawUnsafe' | '$executeRawUnsafe'>;

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let start = 0;
  let quote: "'" | '"' | null = null;
  let dollarTag: string | null = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sql.length; i += 1) {
    const ch = sql[i];
    const next = sql[i + 1];
    if (lineComment) { if (ch === '\n') lineComment = false; continue; }
    if (blockComment) { if (ch === '*' && next === '/') { blockComment = false; i += 1; } continue; }
    if (!quote && !dollarTag && ch === '-' && next === '-') { lineComment = true; i += 1; continue; }
    if (!quote && !dollarTag && ch === '/' && next === '*') { blockComment = true; i += 1; continue; }
    if (dollarTag) { if (sql.startsWith(dollarTag, i)) { i += dollarTag.length - 1; dollarTag = null; } continue; }
    if (!quote && ch === '
class PrismaSqlMigrationQueryClient implements SqlMigrationQueryClient {
  constructor(private readonly client: RawSqlClient) {}

  async query<T = unknown>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<T> {
    const trimmed = sql.trimStart().toUpperCase();
    if (trimmed.startsWith('SELECT')) {
      const rows = await this.client.$queryRawUnsafe<T[]>(sql, ...params);
      return { rows } as T;
    }

    const statements = params.length === 0 ? splitSqlStatements(sql) : [sql];
    let result: unknown;
    for (const statement of statements) {
      result = await this.client.$executeRawUnsafe(statement, ...params);
    }
    return result as T;
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
) { const match = sql.slice(i).match(/^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/); if (match) { dollarTag = match[0]; i += match[0].length - 1; continue; } }
    if (quote) { if (ch === quote) { if (quote === "'" && next === "'") { i += 1; } else quote = null; } continue; }
    if (ch === "'" || ch === '"') { quote = ch; continue; }
    if (ch === ';') { const statement = sql.slice(start, i).trim(); if (statement) statements.push(statement); start = i + 1; }
  }
  const tail = sql.slice(start).trim();
  if (tail) statements.push(tail);
  return statements;
}

class PrismaSqlMigrationQueryClient implements SqlMigrationQueryClient {
  constructor(private readonly client: RawSqlClient) {}

  async query<T = unknown>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<T> {
    const trimmed = sql.trimStart().toUpperCase();
    if (trimmed.startsWith('SELECT')) {
      const rows = await this.client.$queryRawUnsafe<T[]>(sql, ...params);
      return { rows } as T;
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

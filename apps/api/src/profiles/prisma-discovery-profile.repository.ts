import { Injectable } from '@nestjs/common';
import {
  createGeographicScope,
  createProfile,
  type DiscoveryPage,
  type DiscoveryProfileRepository,
  type DiscoveryQuery,
  type Profile,
} from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';

type Cursor = { id: string };

function encodeCursor(value: Cursor): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}
function decodeCursor(value: string): Cursor {
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed.id !== 'string' || !parsed.id) throw new Error();
    return parsed;
  } catch {
    throw new Error('Discovery cursor is invalid');
  }
}

@Injectable()
export class PrismaDiscoveryProfileRepository implements DiscoveryProfileRepository {
  constructor(private readonly database: DatabaseService) {}

  async discover(query: DiscoveryQuery): Promise<DiscoveryPage> {
    const cursor = query.cursor ? decodeCursor(query.cursor) : undefined;
    const rows = await this.database.profile.findMany({
      where: { categoryId: query.categoryId },
      orderBy: { id: 'asc' },
      ...(cursor ? { cursor: { id: cursor.id }, skip: 1 } : {}),
      take: query.limit + 1,
    });
    const hasNext = rows.length > query.limit;
    const items = rows.slice(0, query.limit).map((row) => this.map(row));
    const last = items.at(-1);
    return { items, ...(hasNext && last ? { nextCursor: encodeCursor({ id: last.id }) } : {}) };
  }

  private map(row: {
    id: string; accountId: string; categoryId: string; fields: unknown;
    scopeKind: string; countryCode: string | null; regionCode: string | null;
  }): Profile {
    if (typeof row.fields !== 'object' || row.fields === null || Array.isArray(row.fields)) throw new Error('Persisted profile fields must be an object');
    const scope = row.scopeKind === 'global'
      ? createGeographicScope({ kind: 'global' })
      : row.scopeKind === 'country' && row.countryCode
        ? createGeographicScope({ kind: 'country', countryCode: row.countryCode })
        : row.scopeKind === 'region' && row.countryCode && row.regionCode
          ? createGeographicScope({ kind: 'region', countryCode: row.countryCode, regionCode: row.regionCode })
          : (() => { throw new Error('Persisted profile geographic scope is invalid'); })();
    return createProfile({
      id: row.id, accountId: row.accountId, categoryId: row.categoryId,
      fields: row.fields as Record<string, string | number | boolean | null>, geographicScope: scope,
    });
  }
}

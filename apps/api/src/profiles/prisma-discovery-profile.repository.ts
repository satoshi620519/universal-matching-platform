import { Injectable } from '@nestjs/common';
import {
  createGeographicScope,
  createPrivateLocation,
  createProfile,
  isWithinDistance,
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

function geographicWhere(scope: DiscoveryQuery['geographicScope']) {
  if (scope.kind === 'global') return {};
  const candidates: Array<Record<string, unknown>> = [
    { scopeKind: 'global' },
    { scopeKind: 'country', countryCode: scope.countryCode },
  ];
  if (scope.kind === 'region' || scope.kind === 'city') {
    candidates.push({ scopeKind: 'region', countryCode: scope.countryCode, regionCode: scope.regionCode });
  }
  if (scope.kind === 'city') {
    candidates.push({
      scopeKind: 'city',
      countryCode: scope.countryCode,
      regionCode: scope.regionCode,
      localityCode: scope.localityCode,
    });
  }
  return { OR: candidates };
}

@Injectable()
export class PrismaDiscoveryProfileRepository implements DiscoveryProfileRepository {
  constructor(private readonly database: DatabaseService) {}

  async discover(query: DiscoveryQuery): Promise<DiscoveryPage> {
    const initialCursor = query.cursor ? decodeCursor(query.cursor) : undefined;
    if (!query.distanceConstraint) return this.discoverPage(query, initialCursor);

    const subject = await this.database.profile.findFirst({
      where: { accountId: query.subjectAccountId },
      select: { privateLatitude: true, privateLongitude: true },
    });
    if (subject?.privateLatitude === null || subject?.privateLongitude === null || !subject) {
      return { items: [] };
    }
    const subjectLocation = createPrivateLocation({
      latitude: subject.privateLatitude,
      longitude: subject.privateLongitude,
    });

    const eligible: Profile[] = [];
    let cursor = initialCursor;
    let hasMore = true;
    while (eligible.length <= query.limit && hasMore) {
      const page = await this.fetchPage(query, cursor);
      hasMore = page.rows.length > query.limit;
      for (const row of page.rows.slice(0, query.limit)) {
        const candidate = this.map(row);
        if (candidate.privateLocation && isWithinDistance(subjectLocation, candidate.privateLocation, query.distanceConstraint)) {
          eligible.push(candidate);
          if (eligible.length === query.limit + 1) break;
        }
        cursor = { id: row.id };
      }
      if (page.rows.length === 0) break;
      if (eligible.length > query.limit) break;
      if (!hasMore) break;
      if (cursor === undefined) break;
    }

    const items = eligible.slice(0, query.limit);
    const last = items.at(-1);
    return {
      items,
      ...(last && eligible.length > query.limit ? { nextCursor: encodeCursor({ id: last.id }) } : {}),
    };
  }

  private async discoverPage(query: DiscoveryQuery, cursor: Cursor | undefined): Promise<DiscoveryPage> {
    const page = await this.fetchPage(query, cursor);
    const hasNext = page.rows.length > query.limit;
    const items = page.rows.slice(0, query.limit).map((row) => this.map(row));
    const last = items.at(-1);
    return { items, ...(hasNext && last ? { nextCursor: encodeCursor({ id: last.id }) } : {}) };
  }

  private async fetchPage(query: DiscoveryQuery, cursor: Cursor | undefined) {
    const rows = await this.database.profile.findMany({
      where: {
        categoryId: query.categoryId,
        accountId: { not: query.subjectAccountId },
        ...geographicWhere(query.geographicScope),
      },
      orderBy: { id: 'asc' },
      ...(cursor ? { cursor: { id: cursor.id }, skip: 1 } : {}),
      take: query.limit + 1,
    });
    return { rows };
  }

  private map(row: {
    id: string; accountId: string; categoryId: string; fields: unknown;
    scopeKind: string; countryCode: string | null; regionCode: string | null; localityCode?: string | null;
    privateLatitude: number | null; privateLongitude: number | null;
  }): Profile {
    if (typeof row.fields !== 'object' || row.fields === null || Array.isArray(row.fields)) throw new Error('Persisted profile fields must be an object');
    const scope = row.scopeKind === 'global'
      ? createGeographicScope({ kind: 'global' })
      : row.scopeKind === 'country' && row.countryCode
        ? createGeographicScope({ kind: 'country', countryCode: row.countryCode })
        : row.scopeKind === 'region' && row.countryCode && row.regionCode
          ? createGeographicScope({ kind: 'region', countryCode: row.countryCode, regionCode: row.regionCode })
          : row.scopeKind === 'city' && row.countryCode && row.regionCode && row.localityCode
            ? createGeographicScope({ kind: 'city', countryCode: row.countryCode, regionCode: row.regionCode, localityCode: row.localityCode })
            : (() => { throw new Error('Persisted profile geographic scope is invalid'); })();
    const privateLocation = row.privateLatitude === null && row.privateLongitude === null
      ? null
      : row.privateLatitude !== null && row.privateLongitude !== null
        ? createPrivateLocation({ latitude: row.privateLatitude, longitude: row.privateLongitude })
        : (() => { throw new Error('Persisted profile private location is invalid'); })();
    return createProfile({
      id: row.id, accountId: row.accountId, categoryId: row.categoryId,
      fields: row.fields as Record<string, string | number | boolean | null>, geographicScope: scope,
      privateLocation,
    });
  }
}

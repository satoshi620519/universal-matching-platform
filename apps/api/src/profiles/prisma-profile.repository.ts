import { Injectable } from '@nestjs/common';
import { createGeographicScope, createProfile, type Profile, type ProfileRepository } from '@universal/domain';

import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: string): Promise<Profile | null> {
    const row = await this.database.profile.findUnique({ where: { id } });
    return row ? this.map(row) : null;
  }

  async save(profile: Profile): Promise<void> {
    const scope = profile.geographicScope;
    await this.database.profile.upsert({
      where: { id: profile.id },
      create: {
        id: profile.id, accountId: profile.accountId, categoryId: profile.categoryId,
        fields: profile.fields, scopeKind: scope.kind,
        countryCode: scope.kind === 'global' ? null : scope.countryCode,
        regionCode: scope.kind === 'region' ? scope.regionCode : null,
      },
      update: {
        categoryId: profile.categoryId, fields: profile.fields, scopeKind: scope.kind,
        countryCode: scope.kind === 'global' ? null : scope.countryCode,
        regionCode: scope.kind === 'region' ? scope.regionCode : null,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.database.profile.deleteMany({ where: { id } });
  }

  private map(row: {
    id: string; accountId: string; categoryId: string; fields: unknown;
    scopeKind: string; countryCode: string | null; regionCode: string | null;
  }): Profile {
    if (typeof row.fields !== 'object' || row.fields === null || Array.isArray(row.fields)) {
      throw new Error('Persisted profile fields must be an object');
    }
    const scope = row.scopeKind === 'global'
      ? createGeographicScope({ kind: 'global' })
      : row.scopeKind === 'country' && row.countryCode
        ? createGeographicScope({ kind: 'country', countryCode: row.countryCode })
        : row.scopeKind === 'region' && row.countryCode && row.regionCode
          ? createGeographicScope({ kind: 'region', countryCode: row.countryCode, regionCode: row.regionCode })
          : (() => { throw new Error('Persisted profile geographic scope is invalid'); })();
    return createProfile({
      id: row.id, accountId: row.accountId, categoryId: row.categoryId,
      fields: row.fields as Record<string, string | number | boolean | null>,
      geographicScope: scope,
    });
  }
}

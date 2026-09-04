import { Injectable } from '@nestjs/common';
import {
  createGeographicScope,
  createProfile,
  type Profile,
  type ProfileMedia,
  type ProfileRepository,
} from '@universal/domain';

import { DatabaseService } from '../database/database.service.js';

type PersistedGalleryMedia = Readonly<{
  mediaId: string;
  storageKey: string;
  status: string;
  position: number;
}>;

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly database: DatabaseService) {}

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const row = await this.database.profile.findFirst({
      where: { accountId },
      include: { galleryMedia: { orderBy: { position: 'asc' } } },
    });
    return row ? this.map(row) : null;
  }

  async findById(id: string): Promise<Profile | null> {
    const row = await this.database.profile.findUnique({
      where: { id },
      include: { galleryMedia: { orderBy: { position: 'asc' } } },
    });
    return row ? this.map(row) : null;
  }

  async save(profile: Profile): Promise<void> {
    const scope = profile.geographicScope;
    const avatar = profile.avatar ?? null;
    const gallery = profile.gallery ?? [];
    await this.database.$transaction(async (tx) => {
      await tx.profile.upsert({
        where: { id: profile.id },
        create: {
          id: profile.id, accountId: profile.accountId, categoryId: profile.categoryId,
          fields: profile.fields, scopeKind: scope.kind,
          countryCode: scope.kind === 'global' ? null : scope.countryCode,
          regionCode: scope.kind === 'region' ? scope.regionCode : null,
          avatarId: avatar?.id ?? null,
          avatarStorageKey: avatar?.storageKey ?? null,
          avatarStatus: avatar?.status ?? null,
          biography: profile.biography ?? null,
          verificationStatus: profile.verificationStatus ?? 'unverified',
        },
        update: {
          categoryId: profile.categoryId, fields: profile.fields, scopeKind: scope.kind,
          countryCode: scope.kind === 'global' ? null : scope.countryCode,
          regionCode: scope.kind === 'region' ? scope.regionCode : null,
          avatarId: avatar?.id ?? null,
          avatarStorageKey: avatar?.storageKey ?? null,
          avatarStatus: avatar?.status ?? null,
          biography: profile.biography ?? null,
          verificationStatus: profile.verificationStatus ?? 'unverified',
        },
      });
      await tx.profileGalleryMedia.deleteMany({ where: { profileId: profile.id } });
      if (gallery.length) {
        await tx.profileGalleryMedia.createMany({
          data: gallery.map((media, position) => ({
            profileId: profile.id,
            mediaId: media.id,
            storageKey: media.storageKey,
            status: media.status,
            position,
          })),
        });
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.database.profile.deleteMany({ where: { id } });
  }

  private map(row: {
    id: string; accountId: string; categoryId: string; fields: unknown;
    scopeKind: string; countryCode: string | null; regionCode: string | null;
    avatarId: string | null; avatarStorageKey: string | null; avatarStatus: string | null;
    biography: string | null; verificationStatus: string;
    galleryMedia: readonly PersistedGalleryMedia[];
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
    const avatar = this.mapAvatar(row);
    return createProfile({
      id: row.id, accountId: row.accountId, categoryId: row.categoryId,
      fields: row.fields as Record<string, string | number | boolean | null>,
      geographicScope: scope,
      avatar,
      gallery: row.galleryMedia.map((media) => ({
        id: media.mediaId,
        storageKey: media.storageKey,
        status: media.status,
      })),
      biography: row.biography,
      verificationStatus: this.mapVerificationStatus(row.verificationStatus),
    });
  }

  private mapAvatar(row: {
    avatarId: string | null; avatarStorageKey: string | null; avatarStatus: string | null;
  }): ProfileMedia | null {
    if (row.avatarId === null && row.avatarStorageKey === null && row.avatarStatus === null) return null;
    if (!row.avatarId || !row.avatarStorageKey || !this.isMediaStatus(row.avatarStatus)) {
      throw new Error('Persisted profile avatar is invalid');
    }
    return { id: row.avatarId, storageKey: row.avatarStorageKey, status: row.avatarStatus };
  }

  private isMediaStatus(value: string | null): value is NonNullable<Profile['avatar']>['status'] {
    return value === 'pending' || value === 'active' || value === 'removed';
  }

  private mapVerificationStatus(value: string): NonNullable<Profile['verificationStatus']> {
    if (value === 'unverified' || value === 'pending' || value === 'verified' || value === 'rejected') return value;
    throw new Error('Persisted profile verification status is invalid');
  }
}

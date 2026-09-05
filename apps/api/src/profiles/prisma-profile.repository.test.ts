import { describe, expect, it, vi } from 'vitest';
import { createGeographicScope, createProfile } from '@universal/domain';
import { PrismaProfileRepository } from './prisma-profile.repository.js';

describe('PrismaProfileRepository', () => {
  it('persists geographic scope columns without leaking region data into country scope', async () => {
    const upsert = vi.fn();
    const transaction = vi.fn(async (callback) => callback({
      profile: { upsert },
      profileGalleryMedia: { deleteMany: vi.fn(), createMany: vi.fn() },
    }));
    const repository = new PrismaProfileRepository({ $transaction: transaction } as never);
    await repository.save(createProfile({
      id: 'p1', accountId: 'a1', categoryId: 'c1', fields: { age: 20 },
      geographicScope: createGeographicScope({ kind: 'country', countryCode: 'jp' }),
    }));
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ scopeKind: 'country', countryCode: 'JP', regionCode: null, localityCode: null }),
    }));
  });

  it('persists city locality without leaking it into broader scopes', async () => {
    const upsert = vi.fn();
    const repository = new PrismaProfileRepository({
      $transaction: vi.fn(async (callback) => callback({
        profile: { upsert },
        profileGalleryMedia: { deleteMany: vi.fn(), createMany: vi.fn() },
      })),
    } as never);
    await repository.save(createProfile({
      id: 'p1', accountId: 'a1', categoryId: 'c1', fields: {},
      geographicScope: createGeographicScope({ kind: 'city', countryCode: 'jp', regionCode: '13', localityCode: 'tokyo' }),
    }));
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({
        scopeKind: 'city', countryCode: 'JP', regionCode: '13', localityCode: 'tokyo',
      }),
      update: expect.objectContaining({
        scopeKind: 'city', countryCode: 'JP', regionCode: '13', localityCode: 'tokyo',
      }),
    }));
  });

  it('persists private coordinates without exposing them through geographic scope fields', async () => {
    const upsert = vi.fn();
    const repository = new PrismaProfileRepository({
      $transaction: vi.fn(async (callback) => callback({
        profile: { upsert },
        profileGalleryMedia: { deleteMany: vi.fn(), createMany: vi.fn() },
      })),
    } as never);
    await repository.save(createProfile({
      id: 'p1', accountId: 'a1', categoryId: 'c1', fields: {},
      geographicScope: createGeographicScope({ kind: 'city', countryCode: 'jp', regionCode: '13', localityCode: 'tokyo' }),
      privateLocation: { latitude: 35.681236, longitude: 139.767125 },
    }));
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ privateLatitude: 35.681236, privateLongitude: 139.767125 }),
      update: expect.objectContaining({ privateLatitude: 35.681236, privateLongitude: 139.767125 }),
    }));
  });

  it('replaces ordered gallery atomically with profile metadata', async () => {
    const upsert = vi.fn();
    const deleteMany = vi.fn();
    const createMany = vi.fn();
    const repository = new PrismaProfileRepository({
      $transaction: vi.fn(async (callback) => callback({
        profile: { upsert },
        profileGalleryMedia: { deleteMany, createMany },
      })),
    } as never);
    await repository.save(createProfile({
      id: 'p1', accountId: 'a1', categoryId: 'c1', fields: {},
      geographicScope: createGeographicScope({ kind: 'global' }),
      avatar: { id: 'avatar', storageKey: 'avatar/1', status: 'active' },
      gallery: [{ id: 'g1', storageKey: 'gallery/1', status: 'pending' }],
      biography: 'Hello',
      verificationStatus: 'verified',
    }));
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({
        avatarId: 'avatar', avatarStorageKey: 'avatar/1', avatarStatus: 'active',
        biography: 'Hello', verificationStatus: 'verified',
      }),
    }));
    expect(deleteMany).toHaveBeenCalledWith({ where: { profileId: 'p1' } });
    expect(createMany).toHaveBeenCalledWith({ data: [{
      profileId: 'p1', mediaId: 'g1', storageKey: 'gallery/1', status: 'pending', position: 0,
    }] });
  });

  it('rejects malformed persisted geographic scope combinations', async () => {
    const repository = new PrismaProfileRepository({
      profile: { findUnique: vi.fn().mockResolvedValue({
        id: 'p1', accountId: 'a1', categoryId: 'c1', fields: {},
        scopeKind: 'region', countryCode: null, regionCode: '13', localityCode: null,
        privateLatitude: null, privateLongitude: null,
        avatarId: null, avatarStorageKey: null, avatarStatus: null,
        biography: null, verificationStatus: 'unverified', galleryMedia: [],
      }) },
    } as never);
    await expect(repository.findById('p1')).rejects.toThrow('geographic scope is invalid');
  });

  it('rejects malformed persisted private coordinates', async () => {
    const repository = new PrismaProfileRepository({
      profile: { findUnique: vi.fn().mockResolvedValue({
        id: 'p1', accountId: 'a1', categoryId: 'c1', fields: {},
        scopeKind: 'country', countryCode: 'JP', regionCode: null, localityCode: null,
        privateLatitude: 91, privateLongitude: 139,
        avatarId: null, avatarStorageKey: null, avatarStatus: null,
        biography: null, verificationStatus: 'unverified', galleryMedia: [],
      }) },
    } as never);
    await expect(repository.findById('p1')).rejects.toThrow('latitude must be between -90 and 90');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { createGeographicScope, createProfile } from '@universal/domain';
import { PrismaProfileRepository } from './prisma-profile.repository.js';

describe('PrismaProfileRepository', () => {
  it('persists geographic scope columns without leaking region data into country scope', async () => {
    const upsert = vi.fn();
    const repository = new PrismaProfileRepository({ profile: { upsert } } as never);
    await repository.save(createProfile({
      id: 'p1', accountId: 'a1', categoryId: 'c1', fields: { age: 20 },
      geographicScope: createGeographicScope({ kind: 'country', countryCode: 'jp' }),
    }));
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ scopeKind: 'country', countryCode: 'JP', regionCode: null }),
    }));
  });

  it('rejects malformed persisted geographic scope combinations', async () => {
    const repository = new PrismaProfileRepository({
      profile: { findUnique: vi.fn().mockResolvedValue({
        id: 'p1', accountId: 'a1', categoryId: 'c1', fields: {},
        scopeKind: 'region', countryCode: null, regionCode: '13',
      }) },
    } as never);
    await expect(repository.findById('p1')).rejects.toThrow('geographic scope is invalid');
  });
});

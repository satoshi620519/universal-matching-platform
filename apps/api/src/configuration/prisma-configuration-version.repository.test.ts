import { describe, expect, it, vi } from 'vitest';
import { PrismaConfigurationVersionRepository } from './prisma-configuration-version.repository.js';

describe('PrismaConfigurationVersionRepository', () => {
  it('creates a draft without applying runtime precedence', async () => {
    const create = vi.fn().mockResolvedValue({
      id: 'v1', scope: 'deployment', status: 'draft', versionNumber: 1n,
      createdAt: new Date('2026-01-01'), publishedAt: null, supersededAt: null,
    });
    const repository = new PrismaConfigurationVersionRepository({
      configurationVersion: { create },
    } as any);

    const result = await repository.createDraft('deployment', 1n);

    expect(create).toHaveBeenCalledWith({ data: { scope: 'deployment', status: 'draft', versionNumber: 1n } });
    expect(result.status).toBe('draft');
  });

  it('loads only draft and current published records', async () => {
    const findFirst = vi.fn()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        id: 'v2', scope: 'region', status: 'published', versionNumber: 2n,
        createdAt: new Date(), publishedAt: new Date(), supersededAt: null,
      });
    const repository = new PrismaConfigurationVersionRepository({
      configurationVersion: { findFirst },
    } as any);

    expect(await repository.findDraft('missing')).toBeUndefined();
    const published = await repository.findPublished('region');

    expect(findFirst).toHaveBeenNthCalledWith(1, { where: { id: 'missing', status: 'draft' } });
    expect(findFirst).toHaveBeenNthCalledWith(2, { where: { scope: 'region', status: 'published' }, orderBy: { publishedAt: 'desc' } });
    expect(published?.status).toBe('published');
  });
});

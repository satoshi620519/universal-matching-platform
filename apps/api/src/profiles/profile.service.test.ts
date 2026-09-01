import { describe, expect, it, vi } from 'vitest';
import { ProfileService } from './profile.service.js';

describe('ProfileService', () => {
  const category = { id: 'c1', key: 'dating', displayName: 'Dating' };
  const scope = { kind: 'global' } as const;

  it('rejects creation when the category does not exist', async () => {
    const service = new ProfileService(
      { save: vi.fn(), findById: vi.fn(), delete: vi.fn() },
      { findById: vi.fn().mockResolvedValue(null), findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    await expect(service.create({ accountId: 'a1', categoryId: 'missing', fields: {}, geographicScope: scope }))
      .rejects.toThrow('profile category not found');
  });

  it('creates only after category existence is confirmed', async () => {
    const save = vi.fn();
    const service = new ProfileService(
      { save, findById: vi.fn(), delete: vi.fn() },
      { findById: vi.fn().mockResolvedValue(category), findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    const profile = await service.create({ accountId: 'a1', categoryId: 'c1', fields: { age: 20 }, geographicScope: scope });
    expect(profile.categoryId).toBe('c1');
    expect(save).toHaveBeenCalledWith(profile);
  });

  it('rejects updates for profiles that do not exist', async () => {
    const service = new ProfileService(
      { save: vi.fn(), findById: vi.fn().mockResolvedValue(null), delete: vi.fn() },
      { findById: vi.fn(), findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    await expect(service.update('missing', { fields: {} })).rejects.toThrow('profile not found');
  });

  it('does not query category persistence when the category is unchanged', async () => {
    const findById = vi.fn().mockResolvedValue({
      id: 'p1', accountId: 'a1', categoryId: 'c1', fields: {}, geographicScope: scope,
    });
    const categoryLookup = vi.fn();
    const save = vi.fn();
    const service = new ProfileService(
      { save, findById, delete: vi.fn() },
      { findById: categoryLookup, findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    await service.update('p1', { fields: { age: 21 } });
    expect(categoryLookup).not.toHaveBeenCalled();
    expect(save).toHaveBeenCalledTimes(1);
  });
});

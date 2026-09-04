import { describe, expect, it, vi } from 'vitest';
import { ProfileService } from './profile.service.js';

describe('ProfileService', () => {
  const category = { id: 'c1', key: 'dating', displayName: 'Dating' };
  const scope = { kind: 'global' } as const;
  const schema = { displayName: { kind: 'string', required: true, minLength: 2 } } as const;

  it('rejects creation when the category does not exist', async () => {
    const service = new ProfileService(
      { save: vi.fn(), findById: vi.fn(), delete: vi.fn() },
      { findById: vi.fn().mockResolvedValue(null), findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    await expect(service.create({ accountId: 'a1', categoryId: 'missing', fields: {}, fieldSchema: schema, geographicScope: scope }))
      .rejects.toThrow('profile category not found');
  });

  it('creates only after category existence is confirmed', async () => {
    const save = vi.fn();
    const service = new ProfileService(
      { save, findById: vi.fn(), delete: vi.fn() },
      { findById: vi.fn().mockResolvedValue(category), findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    const profile = await service.create({ accountId: 'a1', categoryId: 'c1', fields: { displayName: 'Satoshi' }, fieldSchema: schema, geographicScope: scope });
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


  it('validates category field rules before persistence', async () => {
    const save = vi.fn();
    const service = new ProfileService(
      { save, findById: vi.fn(), delete: vi.fn() },
      { findById: vi.fn().mockResolvedValue(category), findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    await expect(service.create({ accountId: 'a1', categoryId: 'c1', fields: { displayName: 'A' }, fieldSchema: schema, geographicScope: scope }))
      .rejects.toThrow('too short');
    expect(save).not.toHaveBeenCalled();
  });
  it('derives completion from current profile and configurable schema without persistence', async () => {
    const profile = {
      id: 'p1', accountId: 'a1', categoryId: 'c1',
      fields: { display_name: 'Satoshi' }, geographicScope: scope,
      avatar: null, gallery: [], biography: null, verificationStatus: 'unverified',
    };
    const save = vi.fn();
    const service = new ProfileService(
      { save, findById: vi.fn().mockResolvedValue(profile), delete: vi.fn() },
      { findById: vi.fn(), findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    const completion = await service.completion('p1', {
      schema: { fields: [
        { key: 'display_name', label: 'Display name', type: 'text', required: true, visibility: 'public' },
      ] },
      policy: { requiredCore: ['avatar', 'verification'] },
    });
    expect(completion).toMatchObject({
      completedRequiredCount: 0,
      totalRequiredCount: 3,
      missingRequirementKeys: ['field:display_name', 'core:avatar', 'core:verification'],
    });
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects completion requests for unknown profiles', async () => {
    const service = new ProfileService(
      { save: vi.fn(), findById: vi.fn().mockResolvedValue(null), delete: vi.fn() },
      { findById: vi.fn(), findByKey: vi.fn(), list: vi.fn(), save: vi.fn() },
    );
    await expect(service.completion('missing', { schema: { fields: [] } }))
      .rejects.toThrow('profile not found');
  });

});

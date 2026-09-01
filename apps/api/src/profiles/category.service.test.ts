import { describe, expect, it, vi } from 'vitest';
import { CategoryService } from './category.service.js';

describe('CategoryService', () => {
  it('rejects duplicate category keys before saving', async () => {
    const save = vi.fn();
    const service = new CategoryService({
      findById: vi.fn(),
      findByKey: vi.fn().mockResolvedValue({ id: 'existing', key: 'dating', displayName: 'Dating' }),
      list: vi.fn(),
      save,
    });
    await expect(service.create({ key: 'dating', displayName: 'Dating' })).rejects.toThrow('category key already exists');
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects updates for missing categories', async () => {
    const service = new CategoryService({
      findById: vi.fn().mockResolvedValue(null), findByKey: vi.fn(), list: vi.fn(), save: vi.fn(),
    });
    await expect(service.update('missing', { displayName: 'New' })).rejects.toThrow('category not found');
  });

  it('checks key uniqueness only when the key changes', async () => {
    const findByKey = vi.fn();
    const save = vi.fn();
    const service = new CategoryService({
      findById: vi.fn().mockResolvedValue({ id: 'c1', key: 'dating', displayName: 'Dating' }),
      findByKey, list: vi.fn(), save,
    });
    await service.update('c1', { displayName: 'Dating Plus' });
    expect(findByKey).not.toHaveBeenCalled();
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('rejects replacement keys owned by another category', async () => {
    const service = new CategoryService({
      findById: vi.fn().mockResolvedValue({ id: 'c1', key: 'dating', displayName: 'Dating' }),
      findByKey: vi.fn().mockResolvedValue({ id: 'c2', key: 'friendship', displayName: 'Friendship' }),
      list: vi.fn(), save: vi.fn(),
    });
    await expect(service.update('c1', { key: 'friendship' })).rejects.toThrow('category key already exists');
  });
});

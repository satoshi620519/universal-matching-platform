import { describe, expect, it } from 'vitest';

import type { CategoryRepository } from './category-repository.js';
import type { ProfileRepository } from './profile-repository.js';

describe('Milestone 3 persistence contracts', () => {
  it('keeps profile persistence scoped to identity operations', () => {
    const repository: ProfileRepository = {
      findById: async () => null,
      save: async () => undefined,
      delete: async () => undefined,
    };
    expect(repository).toBeDefined();
  });

  it('supports category lookup by stable id and key', () => {
    const repository: CategoryRepository = {
      findById: async () => null,
      findByKey: async () => null,
      list: async () => [],
      save: async () => undefined,
    };
    expect(repository).toBeDefined();
  });
});

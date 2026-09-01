import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { createCategory, type Category, type CategoryRepository } from '@universal/domain';

@Injectable()
export class CategoryService {
  constructor(private readonly categories: CategoryRepository) {}

  async create(input: { key: string; displayName: string }): Promise<Category> {
    const normalizedKey = input.key.trim();
    const existing = await this.categories.findByKey(normalizedKey);
    if (existing) throw new Error('category key already exists');

    const category = createCategory({
      id: randomUUID(),
      key: normalizedKey,
      displayName: input.displayName,
    });
    await this.categories.save(category);
    return category;
  }

  async update(id: string, input: { key?: string; displayName?: string }): Promise<Category> {
    const existing = await this.categories.findById(id);
    if (!existing) throw new Error('category not found');

    const key = input.key === undefined ? existing.key : input.key.trim();
    if (key !== existing.key) {
      const conflict = await this.categories.findByKey(key);
      if (conflict && conflict.id !== existing.id) throw new Error('category key already exists');
    }

    const category = createCategory({
      id: existing.id,
      key,
      displayName: input.displayName ?? existing.displayName,
    });
    await this.categories.save(category);
    return category;
  }

  async list(): Promise<readonly Category[]> {
    return this.categories.list();
  }
}

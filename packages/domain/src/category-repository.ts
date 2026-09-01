import type { Category } from './category.js';

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByKey(key: string): Promise<Category | null>;
  list(): Promise<readonly Category[]>;
  save(category: Category): Promise<void>;
}

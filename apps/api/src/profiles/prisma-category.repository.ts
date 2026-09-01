import { Injectable } from '@nestjs/common';
import { createCategory, type Category, type CategoryRepository } from '@universal/domain';

import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: string): Promise<Category | null> {
    const row = await this.database.category.findUnique({ where: { id } });
    return row ? this.map(row) : null;
  }

  async findByKey(key: string): Promise<Category | null> {
    const row = await this.database.category.findUnique({ where: { key } });
    return row ? this.map(row) : null;
  }

  async list(): Promise<readonly Category[]> {
    return (await this.database.category.findMany({ orderBy: { key: 'asc' } })).map((row) => this.map(row));
  }

  async save(category: Category): Promise<void> {
    await this.database.category.upsert({
      where: { id: category.id },
      create: category,
      update: { key: category.key, displayName: category.displayName },
    });
  }

  private map(row: { id: string; key: string; displayName: string }): Category {
    return createCategory(row);
  }
}

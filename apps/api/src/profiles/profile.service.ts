import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  createProfile,
  type CategoryRepository,
  type GeographicScope,
  type Profile,
  type ProfileFieldValue,
  type ProfileRepository,
} from '@universal/domain';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profiles: ProfileRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async create(input: {
    accountId: string;
    categoryId: string;
    fields: Record<string, ProfileFieldValue>;
    geographicScope: GeographicScope;
  }): Promise<Profile> {
    const category = await this.categories.findById(input.categoryId);
    if (!category) throw new Error('profile category not found');

    const profile = createProfile({
      id: randomUUID(),
      accountId: input.accountId,
      categoryId: category.id,
      fields: input.fields,
      geographicScope: input.geographicScope,
    });
    await this.profiles.save(profile);
    return profile;
  }

  async update(id: string, input: {
    categoryId?: string;
    fields?: Record<string, ProfileFieldValue>;
    geographicScope?: GeographicScope;
  }): Promise<Profile> {
    const existing = await this.profiles.findById(id);
    if (!existing) throw new Error('profile not found');

    const categoryId = input.categoryId ?? existing.categoryId;
    if (categoryId !== existing.categoryId && !(await this.categories.findById(categoryId))) {
      throw new Error('profile category not found');
    }

    const profile = createProfile({
      ...existing,
      categoryId,
      fields: input.fields ?? existing.fields,
      geographicScope: input.geographicScope ?? existing.geographicScope,
    });
    await this.profiles.save(profile);
    return profile;
  }
}

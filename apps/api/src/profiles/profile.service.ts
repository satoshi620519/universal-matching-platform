import { Injectable, Optional } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  createProfile,
  type CategoryRepository,
  type GeographicScope,
  type Profile,
  type ProfileFieldValue,
  type ProfileRepository,
  type ProfileFieldSchema,
  validateProfileFields,
  calculateProfileCompletion,
  validateProfileAgainstSchema,
  type ProfileCompletion,
  type ProfileCompletionPolicy,
  type ProfileSchemaConfiguration,
} from '@universal/domain';
import { CategoryFieldSchemaService } from './category-field-schema.service.js';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profiles: ProfileRepository,
    private readonly categories: CategoryRepository,
    @Optional() private readonly categoryFieldSchemas?: CategoryFieldSchemaService,
  ) {}

  async create(input: {
    accountId: string;
    categoryId: string;
    fields: Record<string, ProfileFieldValue>;
    fieldSchema?: ProfileFieldSchema;
    geographicScope: GeographicScope;
    avatar?: Profile['avatar'];
    gallery?: Profile['gallery'];
    biography?: Profile['biography'];
    verificationStatus?: Profile['verificationStatus'];
  }): Promise<Profile> {
    const category = await this.categories.findById(input.categoryId);
    if (!category) throw new Error('profile category not found');

    const fieldSchema = input.fieldSchema ?? this.categoryFieldSchemas?.schemaFor(category.key);
    if (!fieldSchema) throw new Error('profile field schema not configured');
    validateProfileFields(fieldSchema, input.fields);

    const profile = createProfile({
      id: randomUUID(),
      accountId: input.accountId,
      categoryId: category.id,
      fields: input.fields,
      geographicScope: input.geographicScope,
      avatar: input.avatar,
      gallery: input.gallery,
      biography: input.biography,
      verificationStatus: input.verificationStatus,
    });
    await this.profiles.save(profile);
    return profile;
  }

  async completion(id: string, input: {
    schema: ProfileSchemaConfiguration;
    policy?: ProfileCompletionPolicy;
  }): Promise<ProfileCompletion> {
    const profile = await this.profiles.findById(id);
    if (!profile) throw new Error('profile not found');
    validateProfileAgainstSchema(profile.fields, input.schema);
    return calculateProfileCompletion(profile, input.schema, input.policy);
  }

  async update(id: string, input: {
    categoryId?: string;
    fields?: Record<string, ProfileFieldValue>;
    fieldSchema?: ProfileFieldSchema;
    geographicScope?: GeographicScope;
    avatar?: Profile['avatar'];
    gallery?: Profile['gallery'];
    biography?: Profile['biography'];
    verificationStatus?: Profile['verificationStatus'];
  }): Promise<Profile> {
    const existing = await this.profiles.findById(id);
    if (!existing) throw new Error('profile not found');

    const categoryId = input.categoryId ?? existing.categoryId;
    const needsFieldValidation = input.fields !== undefined || input.categoryId !== undefined;
    const category = needsFieldValidation
      ? await this.categories.findById(categoryId)
      : undefined;
    if (needsFieldValidation && !category) {
      throw new Error('profile category not found');
    }

    const fields = input.fields ?? existing.fields;
    const fieldSchema = input.fieldSchema
      ?? (category ? this.categoryFieldSchemas?.schemaFor(category.key) : undefined);
    if (needsFieldValidation) {
      if (!fieldSchema) throw new Error('profile field schema not configured');
      validateProfileFields(fieldSchema, fields);
    }

    const profile = createProfile({
      ...existing,
      categoryId,
      fields,
      geographicScope: input.geographicScope ?? existing.geographicScope,
      avatar: input.avatar === undefined ? existing.avatar : input.avatar,
      gallery: input.gallery === undefined ? existing.gallery : input.gallery,
      biography: input.biography === undefined ? existing.biography : input.biography,
      verificationStatus: input.verificationStatus ?? existing.verificationStatus,
    });
    await this.profiles.save(profile);
    return profile;
  }
}

import { Injectable } from '@nestjs/common';
import type { ProfileFieldSchema } from '@universal/domain';

const BASE: ProfileFieldSchema = {
  displayName: { kind: 'string', required: true, minLength: 1, maxLength: 80 },
  headline: { kind: 'string', maxLength: 240 },
  bio: { kind: 'string', maxLength: 2000 },
};

const BY_CATEGORY_KEY: Readonly<Record<string, ProfileFieldSchema>> = {
  dating: { ...BASE, age: { kind: 'number', minimum: 18, maximum: 120 }, interests: { kind: 'string', maxLength: 300 } },
  business: { ...BASE, company: { kind: 'string', maxLength: 120 }, role: { kind: 'string', maxLength: 120 } },
  freelance: { ...BASE, skills: { kind: 'string', required: true, maxLength: 500 }, hourlyRate: { kind: 'number', minimum: 0 } },
  travel: { ...BASE, destination: { kind: 'string', maxLength: 120 }, travelStyle: { kind: 'string', maxLength: 120 } },
  community: { ...BASE, interests: { kind: 'string', maxLength: 300 } },
  mentorship: { ...BASE, expertise: { kind: 'string', maxLength: 300 }, mentoringTopics: { kind: 'string', maxLength: 300 } },
};

@Injectable()
export class CategoryFieldSchemaService {
  schemaFor(categoryKey: string): ProfileFieldSchema { return BY_CATEGORY_KEY[categoryKey] ?? BASE; }
}

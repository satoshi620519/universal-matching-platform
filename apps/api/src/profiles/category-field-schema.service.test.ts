import { describe, expect, it } from 'vitest';
import { CategoryFieldSchemaService } from './category-field-schema.service.js';

describe('CategoryFieldSchemaService', () => {
  const service = new CategoryFieldSchemaService();

  it('returns category-specific fields while retaining shared profile fields', () => {
    const schema = service.schemaFor('freelance');
    expect(schema.displayName.required).toBe(true);
    expect(schema.skills.required).toBe(true);
    expect(schema.hourlyRate.kind).toBe('number');
  });

  it('falls back to the safe base schema for unknown categories', () => {
    const schema = service.schemaFor('unknown-category');
    expect(Object.keys(schema)).toEqual(['displayName','headline','bio']);
  });
});

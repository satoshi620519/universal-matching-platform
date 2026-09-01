import { describe, expect, it } from 'vitest';
import { validateProfileFields } from './profile-field-schema.js';

describe('category-specific profile field validation', () => {
  const schema = {
    displayName: { kind: 'string', required: true, minLength: 2, maxLength: 20 },
    age: { kind: 'number', minimum: 18, maximum: 120 },
    discoverable: { kind: 'boolean' },
  } as const;

  it('accepts values valid for the category schema', () => {
    expect(() => validateProfileFields(schema, { displayName: 'Satoshi', age: 20, discoverable: true })).not.toThrow();
  });

  it('rejects fields not declared by the category schema', () => {
    expect(() => validateProfileFields(schema, { displayName: 'Ok', secret: 'x' })).toThrow('not allowed');
  });

  it('rejects missing required fields', () => {
    expect(() => validateProfileFields(schema, { age: 20 })).toThrow('required');
  });

  it('rejects wrong primitive types', () => {
    expect(() => validateProfileFields(schema, { displayName: 20 as never })).toThrow('must be string');
  });

  it('enforces string and number boundaries', () => {
    expect(() => validateProfileFields(schema, { displayName: 'A', age: 17 })).toThrow('too short');
    expect(() => validateProfileFields(schema, { displayName: 'A'.repeat(21), age: 20 })).toThrow('too long');
    expect(() => validateProfileFields(schema, { displayName: 'Okay', age: 121 })).toThrow('above maximum');
  });
});

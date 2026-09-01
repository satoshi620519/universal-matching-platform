import type { ProfileFieldValue } from './profile.js';

export type ProfileFieldRule = Readonly<{
  required?: boolean;
  kind: 'string' | 'number' | 'boolean';
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
}>;

export type ProfileFieldSchema = Readonly<Record<string, ProfileFieldRule>>;

export function validateProfileFields(
  schema: ProfileFieldSchema,
  fields: Readonly<Record<string, ProfileFieldValue>>,
): void {
  for (const key of Object.keys(fields)) {
    if (!schema[key]) throw new Error(`profile field "${key}" is not allowed for this category`);
  }

  for (const [key, rule] of Object.entries(schema)) {
    const value = fields[key];
    if (value === undefined || value === null) {
      if (rule.required) throw new Error(`profile field "${key}" is required`);
      continue;
    }
    if (typeof value !== rule.kind) throw new Error(`profile field "${key}" must be ${rule.kind}`);
    if (typeof value === 'string') {
      if (rule.minLength !== undefined && value.length < rule.minLength) throw new Error(`profile field "${key}" is too short`);
      if (rule.maxLength !== undefined && value.length > rule.maxLength) throw new Error(`profile field "${key}" is too long`);
    }
    if (typeof value === 'number') {
      if (rule.minimum !== undefined && value < rule.minimum) throw new Error(`profile field "${key}" is below minimum`);
      if (rule.maximum !== undefined && value > rule.maximum) throw new Error(`profile field "${key}" is above maximum`);
    }
  }
}

import type { ProfileFieldValue } from './profile.js';
import type { ProfileFieldVisibility } from './profile-projection.js';

export type ConfigurableProfileFieldType = 'text' | 'number' | 'boolean' | 'date' | 'select';

export interface ConfigurableProfileField {
  readonly key: string;
  readonly label: string;
  readonly type: ConfigurableProfileFieldType;
  readonly required?: boolean;
  readonly visibility: ProfileFieldVisibility;
  readonly options?: readonly string[];
}

export interface ProfileSchemaConfiguration {
  readonly fields: readonly ConfigurableProfileField[];
}

const keyPattern = /^[a-z][a-z0-9_]{1,63}$/;

export function validateProfileSchemaConfiguration(configuration: ProfileSchemaConfiguration): void {
  if (!configuration.fields.length) throw new Error('profile schema requires at least one field');
  const keys = new Set<string>();
  for (const field of configuration.fields) {
    if (!keyPattern.test(field.key)) throw new Error('profile field key must be stable snake_case');
    if (!field.label.trim()) throw new Error('profile field label must not be empty');
    if (keys.has(field.key)) throw new Error('profile field keys must be unique');
    keys.add(field.key);
    if (field.type === 'select' && (!field.options?.length || new Set(field.options).size !== field.options.length)) throw new Error('select fields require unique options');
    if (field.type !== 'select' && field.options?.length) throw new Error('only select fields may define options');
  }
}

export function validateProfileAgainstSchema(values: Readonly<Record<string, ProfileFieldValue>>, schema: ProfileSchemaConfiguration): void {
  validateProfileSchemaConfiguration(schema);
  const fields = new Map(schema.fields.map(field => [field.key, field]));
  for (const field of schema.fields) {
    const value = values[field.key];
    if (field.required && (value === null || value === undefined || value === '')) throw new Error(`required profile field missing: ${field.key}`);
  }
  for (const [key, value] of Object.entries(values)) {
    const field = fields.get(key);
    if (!field) throw new Error(`profile field is not allowed by schema: ${key}`);
    if (value === null) continue;
    if (field.type === 'text' || field.type === 'date') { if (typeof value !== 'string') throw new Error(`profile field type mismatch: ${key}`); }
    if (field.type === 'number' && typeof value !== 'number') throw new Error(`profile field type mismatch: ${key}`);
    if (field.type === 'boolean' && typeof value !== 'boolean') throw new Error(`profile field type mismatch: ${key}`);
    if (field.type === 'select' && (typeof value !== 'string' || !field.options?.includes(value))) throw new Error(`profile field option is invalid: ${key}`);
  }
}

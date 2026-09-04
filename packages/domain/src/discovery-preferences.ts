import type { Profile, ProfileFieldValue } from './profile.js';

export type DiscoveryFieldFilter = Readonly<{
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'minimum';
  value: ProfileFieldValue;
}>;

export type DiscoveryPreferences = Readonly<{
  filters: readonly DiscoveryFieldFilter[];
}>;

export const EMPTY_DISCOVERY_PREFERENCES: DiscoveryPreferences = Object.freeze({ filters: [] });

export function createDiscoveryPreferences(
  input: DiscoveryPreferences = EMPTY_DISCOVERY_PREFERENCES,
): DiscoveryPreferences {
  const seen = new Set<string>();
  for (const filter of input.filters) {
    if (!filter.field.trim()) throw new Error('discovery preference field must not be empty');
    if (filter.value === null) throw new Error('discovery preference value must not be null');
    if (!['equals', 'notEquals', 'contains', 'minimum'].includes(filter.operator)) {
      throw new Error('discovery preference operator is invalid');
    }
    const key = `${filter.field}:${filter.operator}`;
    if (seen.has(key)) throw new Error('discovery preference filters must be unique per field and operator');
    seen.add(key);
  }
  return { filters: input.filters.map((filter) => ({ ...filter })) };
}

export function matchesDiscoveryPreferences(profile: Profile, preferences: DiscoveryPreferences): boolean {
  return preferences.filters.every((filter) => {
    const value = profile.fields[filter.field];
    switch (filter.operator) {
      case 'equals': return value === filter.value;
      case 'notEquals': return value !== filter.value;
      case 'contains':
        return typeof value === 'string' && typeof filter.value === 'string' && value.includes(filter.value);
      case 'minimum':
        return typeof value === 'number' && typeof filter.value === 'number' && value >= filter.value;
    }
  });
}

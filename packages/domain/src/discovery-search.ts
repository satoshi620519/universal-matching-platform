import type { Profile } from './profile.js';

export type DiscoverySearch = Readonly<{
  term: string;
  fields: readonly string[];
}>;

export function createDiscoverySearch(input?: DiscoverySearch): DiscoverySearch | undefined {
  if (!input) return undefined;
  const term = input.term.trim();
  if (!term) throw new Error('discovery search term must not be empty');
  const fields = [...new Set(input.fields.map((field) => field.trim()).filter(Boolean))];
  if (!fields.length) throw new Error('discovery search fields must not be empty');
  return { term, fields };
}

export function matchesDiscoverySearch(profile: Profile, search: DiscoverySearch | undefined): boolean {
  if (!search) return true;
  const needle = search.term.toLocaleLowerCase();
  return search.fields.some((field) => {
    const value = profile.fields[field];
    return typeof value === 'string' && value.toLocaleLowerCase().includes(needle);
  });
}

import type { GeographicScope } from './geographic-scope.js';

export type ProfileFieldValue = string | number | boolean | null;

export type Profile = Readonly<{
  id: string;
  accountId: string;
  categoryId: string;
  fields: Readonly<Record<string, ProfileFieldValue>>;
  geographicScope: GeographicScope;
}>;

export function createProfile(input: Profile): Profile {
  if (!input.id.trim()) throw new Error('Profile id must not be empty');
  if (!input.accountId.trim()) throw new Error('Profile accountId must not be empty');
  if (!input.categoryId.trim()) throw new Error('Profile categoryId must not be empty');
  for (const [key, value] of Object.entries(input.fields)) {
    if (!key.trim()) throw new Error('Profile field key must not be empty');
    if (typeof value === 'object' && value !== null) throw new Error('Profile field values must be primitive');
  }
  return { ...input, fields: { ...input.fields }, geographicScope: { ...input.geographicScope } as GeographicScope };
}

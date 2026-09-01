import type { GeographicScope } from './geographic-scope.js';
import type { Profile, ProfileFieldValue } from './profile.js';

export type ProfileFieldVisibility = 'public' | 'owner' | 'privileged';
export type ProfileViewer = Readonly<{ accountId?: string; privileged?: boolean }>;
export type ProfileProjectionPolicy = Readonly<Record<string, ProfileFieldVisibility>>;

export type ProjectedProfile = Readonly<{
  id: string;
  categoryId: string;
  fields: Readonly<Record<string, ProfileFieldValue>>;
  geographicScope: GeographicScope;
}>;

export function projectProfile(
  profile: Profile,
  viewer: ProfileViewer,
  policy: ProfileProjectionPolicy,
): ProjectedProfile {
  const isOwner = viewer.accountId === profile.accountId;
  const fields = Object.fromEntries(Object.entries(profile.fields).filter(([key]) => {
    const visibility = policy[key];
    return visibility === 'public'
      || (visibility === 'owner' && isOwner)
      || (visibility === 'privileged' && viewer.privileged === true);
  }));
  return {
    id: profile.id,
    categoryId: profile.categoryId,
    fields,
    geographicScope: profile.geographicScope,
  };
}

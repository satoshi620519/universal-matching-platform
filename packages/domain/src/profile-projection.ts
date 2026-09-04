import type { GeographicScope } from './geographic-scope.js';
import type { Profile, ProfileFieldValue, ProfileMedia } from './profile.js';

export type ProfileFieldVisibility = 'public' | 'owner' | 'privileged';
export type ProfileViewer = Readonly<{ accountId?: string; privileged?: boolean }>;
export type ProfileProjectionPolicy = Readonly<Record<string, ProfileFieldVisibility>>;

export type ProfileCoreProjectionPolicy = Readonly<{
  avatar?: ProfileFieldVisibility;
  gallery?: ProfileFieldVisibility;
  biography?: ProfileFieldVisibility;
  verificationStatus?: ProfileFieldVisibility;
}>;

export type ProjectedProfile = Readonly<{
  id: string;
  categoryId: string;
  fields: Readonly<Record<string, ProfileFieldValue>>;
  geographicScope: GeographicScope;
  avatar?: ProfileMedia;
  gallery?: readonly ProfileMedia[];
  biography?: string;
  verificationStatus?: Profile['verificationStatus'];
}>;

function canProject(
  visibility: ProfileFieldVisibility | undefined,
  viewer: ProfileViewer,
  isOwner: boolean,
): boolean {
  return visibility === 'public'
    || (visibility === 'owner' && isOwner)
    || (visibility === 'privileged' && viewer.privileged === true);
}

function activeMedia(media: ProfileMedia | null | undefined): ProfileMedia | undefined {
  return media?.status === 'active' ? media : undefined;
}

export function projectProfile(
  profile: Profile,
  viewer: ProfileViewer,
  policy: ProfileProjectionPolicy,
  corePolicy: ProfileCoreProjectionPolicy = {},
): ProjectedProfile {
  const isOwner = viewer.accountId === profile.accountId;
  const fields = Object.fromEntries(Object.entries(profile.fields).filter(([key]) =>
    canProject(policy[key], viewer, isOwner),
  ));
  const projected: {
    id: string;
    categoryId: string;
    fields: Readonly<Record<string, ProfileFieldValue>>;
    geographicScope: GeographicScope;
    avatar?: ProfileMedia;
    gallery?: readonly ProfileMedia[];
    biography?: string;
    verificationStatus?: Profile['verificationStatus'];
  } = {
    id: profile.id,
    categoryId: profile.categoryId,
    fields,
    geographicScope: profile.geographicScope,
  };
  const avatar = activeMedia(profile.avatar);
  if (avatar && canProject(corePolicy.avatar, viewer, isOwner)) projected.avatar = avatar;
  const gallery = (profile.gallery ?? []).filter(media => media.status === 'active');
  if (gallery.length && canProject(corePolicy.gallery, viewer, isOwner)) projected.gallery = gallery;
  if (profile.biography != null && canProject(corePolicy.biography, viewer, isOwner)) projected.biography = profile.biography;
  if (profile.verificationStatus !== undefined && canProject(corePolicy.verificationStatus, viewer, isOwner)) projected.verificationStatus = profile.verificationStatus;
  return projected;
}

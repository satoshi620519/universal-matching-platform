import type { GeographicScope } from './geographic-scope.js';

export type ProfileFieldValue = string | number | boolean | null;
export type ProfileMediaStatus = 'pending' | 'active' | 'removed';
export type ProfileVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type ProfileMedia = Readonly<{
  id: string;
  storageKey: string;
  status: ProfileMediaStatus;
}>;

export type Profile = Readonly<{
  id: string;
  accountId: string;
  categoryId: string;
  fields: Readonly<Record<string, ProfileFieldValue>>;
  geographicScope: GeographicScope;
  avatar?: ProfileMedia | null;
  gallery?: readonly ProfileMedia[];
  biography?: string | null;
  verificationStatus?: ProfileVerificationStatus;
}>;

const MAX_GALLERY_ITEMS = 12;
const MAX_BIOGRAPHY_LENGTH = 2_000;

function normalizeMedia(media: ProfileMedia): ProfileMedia {
  if (!media.id.trim()) throw new Error('Profile media id must not be empty');
  if (!media.storageKey.trim()) throw new Error('Profile media storageKey must not be empty');
  return { ...media };
}

export function createProfile(input: Profile): Profile {
  if (!input.id.trim()) throw new Error('Profile id must not be empty');
  if (!input.accountId.trim()) throw new Error('Profile accountId must not be empty');
  if (!input.categoryId.trim()) throw new Error('Profile categoryId must not be empty');
  for (const [key, value] of Object.entries(input.fields)) {
    if (!key.trim()) throw new Error('Profile field key must not be empty');
    if (typeof value === 'object' && value !== null) throw new Error('Profile field values must be primitive');
  }
  const gallery = input.gallery ?? [];
  const avatar = input.avatar ?? null;
  const biographyInput = input.biography ?? null;
  const verificationStatus = input.verificationStatus ?? 'unverified';
  if (gallery.length > MAX_GALLERY_ITEMS) throw new Error(`Profile gallery must not exceed ${MAX_GALLERY_ITEMS} items`);
  const galleryIds = new Set<string>();
  for (const media of gallery) {
    if (galleryIds.has(media.id)) throw new Error('Profile gallery media ids must be unique');
    galleryIds.add(media.id);
  }
  const biography = biographyInput === null ? null : biographyInput.trim();
  if (biography !== null && biography.length > MAX_BIOGRAPHY_LENGTH) throw new Error(`Profile biography must not exceed ${MAX_BIOGRAPHY_LENGTH} characters`);
  return {
    ...input,
    fields: { ...input.fields },
    geographicScope: { ...input.geographicScope } as GeographicScope,
    avatar: avatar === null ? null : normalizeMedia(avatar),
    gallery: gallery.map(normalizeMedia),
    biography,
    verificationStatus,
  };
}

export const ProfileLimits = {
  maxGalleryItems: MAX_GALLERY_ITEMS,
  maxBiographyLength: MAX_BIOGRAPHY_LENGTH,
} as const;

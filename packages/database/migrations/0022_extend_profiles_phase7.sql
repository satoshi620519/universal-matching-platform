-- Phase 7 profile core metadata.
-- User field values remain in profiles.fields; this migration stores only first-class
-- metadata needed for media ordering, biography and provider-neutral presentation.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_id TEXT NULL,
  ADD COLUMN IF NOT EXISTS avatar_storage_key TEXT NULL,
  ADD COLUMN IF NOT EXISTS avatar_status TEXT NULL,
  ADD COLUMN IF NOT EXISTS biography TEXT NULL,
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'unverified';

ALTER TABLE profiles
  ADD CONSTRAINT profiles_biography_length_check
  CHECK (biography IS NULL OR char_length(biography) <= 2000);

ALTER TABLE profiles
  ADD CONSTRAINT profiles_avatar_pair_check
  CHECK (
    (avatar_id IS NULL AND avatar_storage_key IS NULL AND avatar_status IS NULL)
    OR
    (avatar_id IS NOT NULL AND avatar_storage_key IS NOT NULL AND avatar_status IS NOT NULL)
  );

CREATE TABLE IF NOT EXISTS profile_gallery_media (
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  status TEXT NOT NULL,
  position INTEGER NOT NULL,
  PRIMARY KEY (profile_id, media_id),
  CONSTRAINT profile_gallery_media_position_check CHECK (position >= 0),
  CONSTRAINT profile_gallery_media_status_check CHECK (status IN ('pending', 'active', 'removed'))
);

CREATE UNIQUE INDEX IF NOT EXISTS profile_gallery_media_profile_position_unique
  ON profile_gallery_media(profile_id, position);

CREATE TABLE IF NOT EXISTS profile_gallery_media (
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  status TEXT NOT NULL,
  position INTEGER NOT NULL,
  PRIMARY KEY (profile_id, media_id),
  CONSTRAINT profile_gallery_media_position_unique UNIQUE (profile_id, position)
);

CREATE INDEX IF NOT EXISTS profile_gallery_media_profile_position_idx
  ON profile_gallery_media(profile_id, position);

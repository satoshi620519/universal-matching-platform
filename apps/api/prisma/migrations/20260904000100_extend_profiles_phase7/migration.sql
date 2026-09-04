ALTER TABLE "profiles"
  ADD COLUMN "avatar_id" TEXT,
  ADD COLUMN "avatar_storage_key" TEXT,
  ADD COLUMN "avatar_status" TEXT,
  ADD COLUMN "biography" TEXT,
  ADD COLUMN "verification_status" TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN "locality_code" TEXT;

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_biography_length_check"
  CHECK ("biography" IS NULL OR char_length("biography") <= 2000);

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_avatar_pair_check"
  CHECK (
    ("avatar_id" IS NULL AND "avatar_storage_key" IS NULL AND "avatar_status" IS NULL)
    OR
    ("avatar_id" IS NOT NULL AND "avatar_storage_key" IS NOT NULL AND "avatar_status" IS NOT NULL)
  );

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_city_scope_locality_check"
  CHECK (("scope_kind" = 'city') = ("locality_code" IS NOT NULL));

CREATE TABLE "profile_gallery_media" (
  "profile_id" UUID NOT NULL,
  "media_id" TEXT NOT NULL,
  "storage_key" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  CONSTRAINT "profile_gallery_media_pkey" PRIMARY KEY ("profile_id", "media_id"),
  CONSTRAINT "profile_gallery_media_position_check" CHECK ("position" >= 0),
  CONSTRAINT "profile_gallery_media_status_check" CHECK ("status" IN ('pending', 'active', 'removed'))
);

CREATE UNIQUE INDEX "profile_gallery_media_profile_position_key"
  ON "profile_gallery_media"("profile_id", "position");

ALTER TABLE "profile_gallery_media"
  ADD CONSTRAINT "profile_gallery_media_profile_id_fkey"
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

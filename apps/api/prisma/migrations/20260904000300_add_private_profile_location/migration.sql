ALTER TABLE "profiles"
  ADD COLUMN "private_latitude" DOUBLE PRECISION,
  ADD COLUMN "private_longitude" DOUBLE PRECISION;

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_private_location_pair_check"
  CHECK (("private_latitude" IS NULL) = ("private_longitude" IS NULL));

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_private_latitude_check"
  CHECK ("private_latitude" IS NULL OR "private_latitude" BETWEEN -90 AND 90),
  ADD CONSTRAINT "profiles_private_longitude_check"
  CHECK ("private_longitude" IS NULL OR "private_longitude" BETWEEN -180 AND 180);

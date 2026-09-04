ALTER TABLE "profiles"
  ADD COLUMN "locality_code" TEXT;

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_city_scope_locality_check"
  CHECK (("scope_kind" = 'city') = ("locality_code" IS NOT NULL));

CREATE INDEX "profiles_scope_city_filter_idx"
  ON "profiles"("scope_kind", "country_code", "region_code", "locality_code");

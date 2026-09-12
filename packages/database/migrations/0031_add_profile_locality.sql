ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS locality_code TEXT;

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_city_scope_locality_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_city_scope_locality_check
  CHECK ((scope_kind = 'city') = (locality_code IS NOT NULL));

CREATE INDEX IF NOT EXISTS profiles_scope_city_filter_idx
  ON profiles(scope_kind, country_code, region_code, locality_code);

-- Enforce the application invariant that each account owns exactly one profile.
-- Existing duplicates must be resolved before applying this migration in production.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_account_id_key ON profiles (account_id);

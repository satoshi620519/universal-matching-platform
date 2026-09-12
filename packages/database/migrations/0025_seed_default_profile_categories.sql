-- Provide the canonical starter categories required by the profile bootstrap/discovery flows.
-- Keep this idempotent so the migration is safe for databases that already contain a subset.
INSERT INTO "categories" ("id", "key", "display_name", "created_at", "updated_at") VALUES
  ('00000000-0000-4000-8000-000000000001', 'dating', 'Dating', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-4000-8000-000000000002', 'business', 'Business', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-4000-8000-000000000003', 'freelance', 'Freelance', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-4000-8000-000000000004', 'travel', 'Travel', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-4000-8000-000000000005', 'community', 'Community', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-4000-8000-000000000006', 'mentorship', 'Mentorship', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

ALTER TABLE "conversation_participants"
  ADD COLUMN IF NOT EXISTS "last_read_at" TIMESTAMPTZ(6);

ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ(6);

CREATE INDEX IF NOT EXISTS "conversation_participants_account_id_last_read_at_idx"
  ON "conversation_participants" ("account_id", "last_read_at");

CREATE INDEX IF NOT EXISTS "messages_conversation_id_deleted_at_created_at_idx"
  ON "messages" ("conversation_id", "deleted_at", "created_at");

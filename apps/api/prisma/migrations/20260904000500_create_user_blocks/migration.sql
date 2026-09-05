CREATE TABLE IF NOT EXISTS "user_blocks" (
  "blocker_account_id" UUID NOT NULL,
  "blocked_account_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("blocker_account_id", "blocked_account_id"),
  CONSTRAINT "user_blocks_blocker_account_id_fkey" FOREIGN KEY ("blocker_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE,
  CONSTRAINT "user_blocks_blocked_account_id_fkey" FOREIGN KEY ("blocked_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE,
  CONSTRAINT "user_blocks_no_self_block" CHECK ("blocker_account_id" <> "blocked_account_id")
);

CREATE INDEX IF NOT EXISTS "user_blocks_blocked_account_id_idx"
  ON "user_blocks" ("blocked_account_id");

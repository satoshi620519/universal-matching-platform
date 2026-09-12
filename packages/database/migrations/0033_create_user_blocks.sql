CREATE TABLE IF NOT EXISTS user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  blocked_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT user_blocks_distinct_accounts_check CHECK (blocker_account_id <> blocked_account_id),
  CONSTRAINT user_blocks_unique_pair UNIQUE (blocker_account_id, blocked_account_id)
);

CREATE INDEX IF NOT EXISTS user_blocks_blocked_account_idx
  ON user_blocks(blocked_account_id);

CREATE INDEX IF NOT EXISTS user_blocks_blocker_account_idx
  ON user_blocks(blocker_account_id);

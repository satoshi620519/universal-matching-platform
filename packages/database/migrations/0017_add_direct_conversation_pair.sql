-- Canonical pair key applies only to direct (two-account) conversations.
-- Group conversations remain represented exclusively by conversation_participants.
CREATE TABLE direct_conversation_pairs (
  account_low_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  account_high_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL UNIQUE REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_low_id, account_high_id),
  CHECK (account_low_id < account_high_id)
);

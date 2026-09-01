CREATE TABLE messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  sender_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_conversation_created_idx
  ON messages (conversation_id, created_at ASC, message_id ASC);
CREATE INDEX messages_sender_created_idx
  ON messages (sender_account_id, created_at DESC);

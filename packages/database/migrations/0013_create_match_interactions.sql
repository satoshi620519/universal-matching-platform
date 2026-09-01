CREATE TABLE match_interactions (
  id UUID PRIMARY KEY,
  actor_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  target_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT match_interactions_actor_target_distinct CHECK (actor_account_id <> target_account_id)
);

CREATE UNIQUE INDEX match_interactions_actor_idempotency_key_key
  ON match_interactions(actor_account_id, idempotency_key);
CREATE UNIQUE INDEX match_interactions_actor_target_key
  ON match_interactions(actor_account_id, target_account_id);
CREATE INDEX match_interactions_target_actor_idx
  ON match_interactions(target_account_id, actor_account_id);

CREATE TABLE audit_records (
  audit_record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_account_id UUID NOT NULL REFERENCES accounts(account_id),
  area TEXT NOT NULL,
  action TEXT NOT NULL,
  target_id TEXT NULL,
  correlation_id TEXT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX audit_records_actor_occurred_idx
  ON audit_records (actor_account_id, occurred_at DESC);
CREATE INDEX audit_records_action_occurred_idx
  ON audit_records (action, occurred_at DESC);
CREATE INDEX audit_records_target_occurred_idx
  ON audit_records (target_id, occurred_at DESC)
  WHERE target_id IS NOT NULL;

CREATE TABLE safety_enforcements (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id),
  restriction TEXT NOT NULL,
  reason_category TEXT NOT NULL,
  status TEXT NOT NULL,
  effective_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NULL,
  revoked_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX safety_enforcements_account_status_effective_at_idx
  ON safety_enforcements (account_id, status, effective_at);

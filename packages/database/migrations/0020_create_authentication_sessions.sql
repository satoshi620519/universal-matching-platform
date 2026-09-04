CREATE TABLE authentication_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  authentication_identity_id TEXT NOT NULL REFERENCES authentication_identities(id) ON DELETE CASCADE,
  security_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NULL,
  CONSTRAINT authentication_sessions_expiry_after_issue CHECK (expires_at > issued_at)
);

CREATE INDEX authentication_sessions_active_account_idx
  ON authentication_sessions(account_id, expires_at)
  WHERE revoked_at IS NULL;

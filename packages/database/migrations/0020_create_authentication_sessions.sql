CREATE TABLE authentication_sessions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  authentication_method TEXT NOT NULL,
  expires_at TIMESTAMPTZ(6) NOT NULL,
  revoked_at TIMESTAMPTZ(6) NULL,
  credential_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX authentication_sessions_account_expires_idx
  ON authentication_sessions(account_id, expires_at);

CREATE INDEX authentication_sessions_expires_idx
  ON authentication_sessions(expires_at);
CREATE TABLE password_recovery_requests (
  id TEXT PRIMARY KEY,
  authentication_identity_id TEXT NOT NULL REFERENCES authentication_identities(id) ON DELETE CASCADE,
  secret_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','consumed','expired','revoked')),
  requested_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ NULL,
  revoked_at TIMESTAMPTZ NULL,
  CONSTRAINT password_recovery_expiry_after_request CHECK (expires_at > requested_at)
);
CREATE INDEX password_recovery_active_identity_idx ON password_recovery_requests(authentication_identity_id,expires_at) WHERE status='active';
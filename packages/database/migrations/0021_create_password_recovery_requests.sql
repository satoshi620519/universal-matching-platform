CREATE TABLE password_recovery_requests (
  id UUID PRIMARY KEY,
  authentication_identity_id UUID NOT NULL REFERENCES authentication_identities(id) ON DELETE CASCADE,
  secret_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  requested_at TIMESTAMPTZ(6) NOT NULL,
  expires_at TIMESTAMPTZ(6) NOT NULL,
  consumed_at TIMESTAMPTZ(6) NULL,
  revoked_at TIMESTAMPTZ(6) NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT password_recovery_status_check CHECK (status IN ('active','consumed','expired','revoked')),
  CONSTRAINT password_recovery_expiry_after_request CHECK (expires_at > requested_at)
);

CREATE INDEX password_recovery_active_identity_idx
  ON password_recovery_requests(authentication_identity_id, expires_at)
  WHERE status = 'active';
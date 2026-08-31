CREATE TABLE IF NOT EXISTS password_credentials (
  authentication_identity_id UUID PRIMARY KEY
    REFERENCES authentication_identities(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

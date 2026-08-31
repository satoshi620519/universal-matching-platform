CREATE TABLE IF NOT EXISTS authentication_identities (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id),
  provider_type TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider_type, provider_subject)
);

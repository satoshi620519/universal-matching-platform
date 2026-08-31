CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id),
  requested_level INTEGER NOT NULL,
  workflow_reference TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ(6),
  expires_at TIMESTAMPTZ(6)
);

CREATE INDEX verification_requests_account_status_idx
  ON verification_requests(account_id, status);

CREATE TABLE IF NOT EXISTS verification_outcomes (
  id UUID PRIMARY KEY,
  verification_request_id UUID NOT NULL REFERENCES verification_requests(id),
  level INTEGER NOT NULL,
  status TEXT NOT NULL,
  decided_at TIMESTAMPTZ(6),
  reason_category TEXT,
  expires_at TIMESTAMPTZ(6),
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX verification_outcomes_request_idx
  ON verification_outcomes(verification_request_id);

CREATE TABLE entitlements (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id),
  entitlement_key TEXT NOT NULL,
  state TEXT NOT NULL,
  effective_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  provider_reference TEXT,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT entitlements_state_check CHECK (state IN ('pending', 'active', 'scheduled-expiration', 'expired', 'revoked', 'suspended')),
  CONSTRAINT entitlements_identity_unique UNIQUE (account_id, entitlement_key, payment_intent_id)
);

CREATE INDEX entitlements_account_key_idx ON entitlements (account_id, entitlement_key);
CREATE INDEX entitlements_active_lookup_idx ON entitlements (account_id, entitlement_key, state, effective_at);

CREATE TABLE roles (
  role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_assignments (
  role_assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id),
  role_id UUID NOT NULL REFERENCES roles(role_id),
  effective_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NULL,
  revoked_at TIMESTAMPTZ NULL,
  assigned_by_account_id UUID NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (expires_at IS NULL OR expires_at > effective_at)
);

CREATE INDEX role_assignments_account_effective_idx
  ON role_assignments (account_id, effective_at);
CREATE INDEX role_assignments_role_effective_idx
  ON role_assignments (role_id, effective_at);

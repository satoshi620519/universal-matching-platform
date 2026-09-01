CREATE TABLE configuration_versions (
  configuration_version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL,
  status TEXT NOT NULL,
  version_number BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ NULL,
  superseded_at TIMESTAMPTZ NULL,
  CHECK (scope IN ('platform', 'deployment', 'region', 'category', 'category-region')),
  CHECK (status IN ('draft', 'published', 'superseded')),
  CHECK ((status = 'draft' AND published_at IS NULL AND superseded_at IS NULL) OR (status = 'published' AND published_at IS NOT NULL AND superseded_at IS NULL) OR (status = 'superseded' AND published_at IS NOT NULL AND superseded_at IS NOT NULL)),
  UNIQUE (scope, version_number)
);
CREATE INDEX configuration_versions_scope_status_created_idx ON configuration_versions (scope, status, created_at DESC);
CREATE UNIQUE INDEX configuration_versions_one_published_per_scope_idx ON configuration_versions (scope) WHERE status = 'published';

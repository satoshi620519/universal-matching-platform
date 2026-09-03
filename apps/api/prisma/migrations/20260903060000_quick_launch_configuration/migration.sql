-- M8 Quick Launch configuration lifecycle
CREATE TABLE quick_launch_configurations (
  version SERIAL PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'superseded')),
  draft JSONB NOT NULL,
  published JSONB,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX quick_launch_configurations_status_version_idx
  ON quick_launch_configurations(status, version);

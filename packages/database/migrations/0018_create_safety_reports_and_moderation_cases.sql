CREATE TABLE safety_reports (
  id UUID PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'content', 'message')),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'triaged', 'closed')),
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX safety_reports_reporter_created_at_idx
  ON safety_reports (reporter_id, created_at DESC, id DESC);

CREATE INDEX safety_reports_status_created_at_idx
  ON safety_reports (status, created_at ASC, id ASC);

CREATE TABLE moderation_cases (
  id UUID PRIMARY KEY,
  report_id UUID NOT NULL UNIQUE REFERENCES safety_reports(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'under-review', 'actioned', 'closed')),
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX moderation_cases_status_created_at_idx
  ON moderation_cases (status, created_at ASC, id ASC);

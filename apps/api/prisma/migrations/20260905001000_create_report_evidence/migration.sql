CREATE TABLE report_evidence (
  id UUID PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES safety_reports(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  context TEXT NOT NULL,
  reference TEXT,
  captured_at TIMESTAMPTZ(6) NOT NULL
);

CREATE INDEX report_evidence_report_captured_id_idx
  ON report_evidence (report_id, captured_at, id);

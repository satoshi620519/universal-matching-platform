ALTER TABLE analytics_events
  RENAME COLUMN id TO analytics_event_id;

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS analytics_events_data_classification_occurred_at_idx
  ON analytics_events (data_classification, occurred_at);

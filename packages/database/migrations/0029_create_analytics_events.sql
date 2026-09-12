CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  version INTEGER NOT NULL,
  occurred_at TIMESTAMPTZ(6) NOT NULL,
  data_classification TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS analytics_events_name_occurred_at_idx
  ON analytics_events (name, occurred_at);

CREATE INDEX IF NOT EXISTS analytics_events_occurred_at_idx
  ON analytics_events (occurred_at);

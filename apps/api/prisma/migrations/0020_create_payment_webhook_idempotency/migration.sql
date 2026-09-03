CREATE TABLE payment_webhook_idempotency (
  event_id TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

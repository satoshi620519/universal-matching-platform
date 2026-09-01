CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ NULL
);

CREATE INDEX notifications_account_created_idx
  ON notifications (account_id, created_at DESC, notification_id DESC);
CREATE INDEX notifications_account_unread_idx
  ON notifications (account_id, created_at DESC)
  WHERE read_at IS NULL;

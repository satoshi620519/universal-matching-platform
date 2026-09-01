ALTER TABLE email_outbox_messages
  ADD COLUMN failed_at TIMESTAMPTZ NULL;

CREATE INDEX email_outbox_messages_status_failed_at_idx
  ON email_outbox_messages (status, failed_at);

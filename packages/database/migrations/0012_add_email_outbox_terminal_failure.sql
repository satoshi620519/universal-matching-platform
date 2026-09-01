ALTER TABLE email_outbox_messages
  ADD COLUMN failed_at TIMESTAMPTZ NULL;

CREATE TABLE email_outbox_messages (
  email_outbox_message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  template_key TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_error TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ NULL,
  CHECK (status IN ('pending', 'processing', 'sent', 'failed'))
);

CREATE INDEX email_outbox_messages_pending_idx
  ON email_outbox_messages (status, available_at, created_at);
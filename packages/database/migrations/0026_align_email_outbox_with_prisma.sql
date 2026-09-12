-- The original email outbox migration predates the current Prisma model.
-- Keep its data-compatible columns, but add the columns Prisma now reads/writes.
ALTER TABLE email_outbox_messages
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS account_id UUID,
  ADD COLUMN IF NOT EXISTS email_address TEXT,
  ADD COLUMN IF NOT EXISTS kind TEXT,
  ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

UPDATE email_outbox_messages
SET
  email_address = COALESCE(email_address, recipient_email),
  kind = COALESCE(kind, template_key),
  attempts = COALESCE(attempts, attempt_count, 0),
  delivered_at = COALESCE(delivered_at, sent_at),
  updated_at = COALESCE(updated_at, created_at, now());

ALTER TABLE email_outbox_messages
  ALTER COLUMN id SET NOT NULL,
  ALTER COLUMN account_id SET NOT NULL,
  ALTER COLUMN email_address SET NOT NULL,
  ALTER COLUMN kind SET NOT NULL,
  ALTER COLUMN attempts SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE email_outbox_messages
  ADD CONSTRAINT email_outbox_messages_pkey_new PRIMARY KEY (id);

ALTER TABLE email_outbox_messages
  ADD CONSTRAINT email_outbox_messages_account_id_fkey
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS email_outbox_messages_status_available_at_idx
  ON email_outbox_messages (status, available_at);
CREATE INDEX IF NOT EXISTS email_outbox_messages_status_failed_at_idx
  ON email_outbox_messages (status, failed_at);
CREATE INDEX IF NOT EXISTS email_outbox_messages_account_id_created_at_idx
  ON email_outbox_messages (account_id, created_at);

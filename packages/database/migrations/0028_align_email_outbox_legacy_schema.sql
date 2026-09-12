-- The original email outbox table still has legacy payload/check constraints.
-- Align the live table with the current Prisma model and repository behavior.
ALTER TABLE email_outbox_messages
  DROP COLUMN IF EXISTS payload;

ALTER TABLE email_outbox_messages
  DROP CONSTRAINT IF EXISTS email_outbox_messages_status_check;

ALTER TABLE email_outbox_messages
  ADD CONSTRAINT email_outbox_messages_status_check
  CHECK (status IN ('pending', 'delivered', 'failed));

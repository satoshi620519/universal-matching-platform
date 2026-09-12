-- The legacy email outbox migration left NOT NULL columns that the current
-- Prisma model no longer writes. Remove them so registration can enqueue mail.
ALTER TABLE email_outbox_messages
  DROP COLUMN IF EXISTS recipient_email,
  DROP COLUMN IF EXISTS template_key,
  DROP COLUMN IF EXISTS attempt_count,
  DROP COLUMN IF EXISTS sent_at;

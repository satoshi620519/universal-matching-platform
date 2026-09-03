ALTER TABLE safety_reports
  ALTER COLUMN target_id TYPE TEXT USING target_id::TEXT;

CREATE TABLE configuration_values (
  configuration_value_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_version_id UUID NOT NULL REFERENCES configuration_versions(configuration_version_id) ON DELETE RESTRICT,
  setting_key TEXT NOT NULL,
  value_type TEXT NOT NULL,
  boolean_value BOOLEAN NULL,
  integer_value BIGINT NULL,
  decimal_value NUMERIC NULL,
  text_value TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (value_type IN ('boolean', 'integer', 'decimal', 'text')),
  CHECK ((value_type = 'boolean' AND boolean_value IS NOT NULL AND integer_value IS NULL AND decimal_value IS NULL AND text_value IS NULL) OR (value_type = 'integer' AND boolean_value IS NULL AND integer_value IS NOT NULL AND decimal_value IS NULL AND text_value IS NULL) OR (value_type = 'decimal' AND boolean_value IS NULL AND integer_value IS NULL AND decimal_value IS NOT NULL AND text_value IS NULL) OR (value_type = 'text' AND boolean_value IS NULL AND integer_value IS NULL AND decimal_value IS NULL AND text_value IS NOT NULL)),
  UNIQUE (configuration_version_id, setting_key)
);
CREATE INDEX configuration_values_version_key_idx ON configuration_values (configuration_version_id, setting_key);

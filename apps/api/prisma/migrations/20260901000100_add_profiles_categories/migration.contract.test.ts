import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migration = readFileSync(resolve(__dirname, 'migration.sql'), 'utf8');

describe('profiles/categories migration contract', () => {
  it('creates both tables and required foreign-key boundaries', () => {
    expect(migration).toContain('CREATE TABLE "categories"');
    expect(migration).toContain('CREATE TABLE "profiles"');
    expect(migration).toContain('REFERENCES "accounts"("id") ON DELETE CASCADE');
    expect(migration).toContain('REFERENCES "categories"("id") ON DELETE RESTRICT');
  });

  it('creates category uniqueness and discovery-supporting indexes', () => {
    expect(migration).toContain('UNIQUE INDEX "categories_key_key"');
    expect(migration).toContain('"profiles_account_id_category_id_idx"');
    expect(migration).toContain('"profiles_scope_kind_country_code_region_code_idx"');
  });
});

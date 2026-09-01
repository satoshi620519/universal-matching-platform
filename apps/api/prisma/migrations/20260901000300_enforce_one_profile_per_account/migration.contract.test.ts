import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migration = readFileSync(resolve(__dirname, 'migration.sql'), 'utf8');

describe('one profile per account migration contract', () => {
  it('enforces account uniqueness without weakening existing profile boundaries', () => {
    expect(migration).toContain('CREATE UNIQUE INDEX');
    expect(migration).toContain('profiles_account_id_key');
    expect(migration).toContain('ON profiles (account_id)');
  });
});

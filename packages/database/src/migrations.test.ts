import { describe, expect, it } from 'vitest';

import { orderMigrationFilenames, parseMigrationFilename } from './migrations.js';

describe('parseMigrationFilename', () => {
  it('parses a valid positive migration version', () => {
    expect(parseMigrationFilename('0001_create_accounts.sql')).toBe(1);
  });

  it('rejects invalid filenames', () => {
    expect(() => parseMigrationFilename('create_accounts.sql')).toThrow();
    expect(() => parseMigrationFilename('0000_create_accounts.sql')).toThrow();
  });
});

describe('orderMigrationFilenames', () => {
  it('orders migrations by numeric version', () => {
    expect(
      orderMigrationFilenames([
        '0010_add_indexes.sql',
        '0001_create_accounts.sql',
        '0002_add_status.sql',
      ]),
    ).toEqual([
      '0001_create_accounts.sql',
      '0002_add_status.sql',
      '0010_add_indexes.sql',
    ]);
  });

  it('rejects duplicate versions', () => {
    expect(() =>
      orderMigrationFilenames([
        '0001_create_accounts.sql',
        '0001_create_entitlements.sql',
      ]),
    ).toThrow('Duplicate migration version: 1');
  });
});

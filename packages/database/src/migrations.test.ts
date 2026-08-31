import { describe, expect, it } from 'vitest';

import {
  orderMigrationFilenames,
  parseMigrationFilename,
  planMigrations,
} from './migrations.js';

describe('parseMigrationFilename', () => {
  it('parses a valid positive migration version', () => {
    expect(parseMigrationFilename('0001_create_accounts.sql')).toBe(1);
  });

  it('rejects invalid filenames', () => {
    expect(() => parseMigrationFilename('create_accounts.sql')).toThrow();
    expect(() => parseMigrationFilename('0000_create_accounts.sql')).toThrow();
  });
});

describe('repository migration sequence', () => {
  it('keeps the committed artifact sequence uniquely ordered', () => {
    expect(
      orderMigrationFilenames([
        '0004_create_safety_enforcements.sql',
        '0002_create_authentication_identities.sql',
        '0001_create_accounts.sql',
        '0003_create_verification.sql',
      ]),
    ).toEqual([
      '0001_create_accounts.sql',
      '0002_create_authentication_identities.sql',
      '0003_create_verification.sql',
      '0004_create_safety_enforcements.sql',
    ]);
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

describe('planMigrations', () => {
  const migrations = [
    { version: 2, filename: '0002_add_status.sql', sql: 'SELECT 2;' },
    { version: 1, filename: '0001_create_accounts.sql', sql: 'SELECT 1;' },
    { version: 3, filename: '0003_add_index.sql', sql: 'SELECT 3;' },
  ];

  it('returns only unapplied migrations in version order', () => {
    expect(planMigrations(migrations, new Set([1]))).toEqual({
      pending: [migrations[0], migrations[2]],
    });
  });

  it('returns no work when every migration is applied', () => {
    expect(planMigrations(migrations, new Set([1, 2, 3]))).toEqual({
      pending: [],
    });
  });

  it('rejects duplicate versions', () => {
    expect(() =>
      planMigrations(
        [
          { version: 1, filename: '0001_create_accounts.sql', sql: '' },
          { version: 1, filename: '0001_other.sql', sql: '' },
        ],
        new Set(),
      ),
    ).toThrow('Duplicate migration version: 1');
  });
});

import { describe, expect, it } from 'vitest';

import {
  orderMigrationFilenames,
  parseMigrationFilename,
  planMigrations,
  validateMigrationArtifacts,
} from './migrations.js';

describe('parseMigrationFilename', () => {
  it('parses a valid positive migration version', () => {
    expect(parseMigrationFilename('0001_create_accounts.sql')).toBe(1);
  });

  it('rejects invalid filenames', () => {
    expect(() => parseMigrationFilename('create_accounts.sql')).toThrow();
    expect(() => parseMigrationFilename('0000_create_accounts.sql')).toThrow();
  });

  it('rejects filenames outside the committed migration naming contract', () => {
    expect(() => parseMigrationFilename('0001_Create_Accounts.sql')).toThrow();
    expect(() => parseMigrationFilename('0001_create_accounts.SQL')).toThrow();
    expect(() => parseMigrationFilename('0001__create_accounts.sql')).toThrow();
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
        '0005_create_email_outbox_messages.sql',
        '0006_add_email_outbox_terminal_failure.sql',
        '0007_create_administration_roles.sql',
        '0008_create_audit_records.sql',
      ]),
    ).toEqual([
      '0001_create_accounts.sql',
      '0002_create_authentication_identities.sql',
      '0003_create_verification.sql',
      '0004_create_safety_enforcements.sql',
      '0005_create_email_outbox_messages.sql',
      '0006_add_email_outbox_terminal_failure.sql',
      '0007_create_administration_roles.sql',
      '0008_create_audit_records.sql',
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

  it('does not mutate the caller filename array', () => {
    const filenames = ['0002_add_status.sql', '0001_create_accounts.sql'];
    orderMigrationFilenames(filenames);
    expect(filenames).toEqual(['0002_add_status.sql', '0001_create_accounts.sql']);
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

  it('ignores applied versions that are not present in committed artifacts', () => {
    expect(planMigrations(migrations, new Set([1, 99]))).toEqual({
      pending: [migrations[0], migrations[2]],
    });
  });

  it('does not require applied versions to arrive in any particular order', () => {
    expect(planMigrations(migrations, new Set([3, 1]))).toEqual({
      pending: [migrations[0]],
    });
  });

  it('does not mutate migration artifacts while planning', () => {
    const original = [...migrations];
    planMigrations(migrations, new Set([1]));
    expect(migrations).toEqual(original);
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


describe('validateMigrationArtifacts', () => {
  it('returns a new ordered array without mutating the caller artifacts', () => {
    const artifacts = [
      { version: 2, filename: '0002_add_status.sql', sql: 'SELECT 2;' },
      { version: 1, filename: '0001_create_accounts.sql', sql: 'SELECT 1;' },
    ];
    const validated = validateMigrationArtifacts(artifacts);
    expect(validated).toEqual([artifacts[1], artifacts[0]]);
    expect(artifacts).toEqual([
      { version: 2, filename: '0002_add_status.sql', sql: 'SELECT 2;' },
      { version: 1, filename: '0001_create_accounts.sql', sql: 'SELECT 1;' },
    ]);
  });

  it('rejects artifacts whose declared version does not match the filename', () => {
    expect(() =>
      validateMigrationArtifacts([
        { version: 2, filename: '0001_create_accounts.sql', sql: 'CREATE TABLE accounts ()' },
      ]),
    ).toThrow('Migration version does not match filename');
  });
});

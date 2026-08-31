import { describe, expect, it } from 'vitest';
import { requireDatabaseConfig } from './database-config.js';

describe('database configuration', () => {
  it('accepts an explicit database URL', () => {
    expect(
      requireDatabaseConfig('postgresql://user:pass@localhost:5432/app').url,
    ).toContain('postgresql://');
  });

  it('rejects missing database configuration', () => {
    expect(() => requireDatabaseConfig(undefined)).toThrow('DATABASE_URL');
  });
});

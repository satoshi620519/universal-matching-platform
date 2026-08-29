import { describe, expect, it } from 'vitest';
import { createDatabaseConfig } from './database.js';

describe('database configuration', () => {
  it('requires DATABASE_URL', () => {
    expect(() => createDatabaseConfig({})).toThrow('DATABASE_URL is required');
  });

  it('uses a safe default pool size', () => {
    expect(createDatabaseConfig({ DATABASE_URL: 'postgres://localhost/app' })).toEqual({
      url: 'postgres://localhost/app',
      poolSize: 10,
    });
  });

  it('accepts a positive integer pool size', () => {
    expect(createDatabaseConfig({ DATABASE_URL: 'postgres://localhost/app', DATABASE_POOL_SIZE: '20' }).poolSize).toBe(20);
  });

  it('rejects an invalid pool size', () => {
    expect(() => createDatabaseConfig({ DATABASE_URL: 'postgres://localhost/app', DATABASE_POOL_SIZE: '0' })).toThrow(
      'DATABASE_POOL_SIZE must be a positive integer',
    );
  });
});

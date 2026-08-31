import { describe, expect, it } from 'vitest';
import { loadRuntimeConfig } from './runtime-config.js';

describe('runtime configuration', () => {
  it('provides safe defaults', () => {
    expect(loadRuntimeConfig({})).toEqual({
      port: 3001,
      host: '0.0.0.0',
      environment: 'development',
      databaseUrl: undefined,
    });
  });

  it('rejects invalid ports', () => {
    expect(() => loadRuntimeConfig({ PORT: 'invalid' })).toThrow('PORT');
  });

  it('keeps database configuration external to source', () => {
    expect(
      loadRuntimeConfig({ DATABASE_URL: 'postgres://runtime-only' }).databaseUrl,
    ).toBe('postgres://runtime-only');
  });
});

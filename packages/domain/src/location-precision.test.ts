import { describe, expect, it } from 'vitest';
import {
  defaultLocationPrecisionPolicy,
  projectGeographicScope,
  validateLocationPrecisionPolicy,
} from './location-precision.js';

describe('location precision policy', () => {
  const city = { kind: 'city', countryCode: 'JP', regionCode: '13', localityCode: '13101' } as const;

  it('defaults to country precision', () => {
    expect(defaultLocationPrecisionPolicy).toEqual({ publicPrecision: 'country' });
    expect(projectGeographicScope(city, defaultLocationPrecisionPolicy))
      .toEqual({ kind: 'country', countryCode: 'JP' });
  });

  it('never exposes more detail than configured', () => {
    expect(projectGeographicScope(city, { publicPrecision: 'region' }))
      .toEqual({ kind: 'region', countryCode: 'JP', regionCode: '13' });
    expect(projectGeographicScope(city, { publicPrecision: 'city' })).toEqual(city);
    expect(projectGeographicScope(city, { publicPrecision: 'none' })).toBeUndefined();
  });

  it('preserves broader source scopes when possible', () => {
    const region = { kind: 'region', countryCode: 'JP', regionCode: '13' } as const;
    expect(projectGeographicScope(region, { publicPrecision: 'city' })).toEqual(region);
    expect(projectGeographicScope({ kind: 'global' }, { publicPrecision: 'country' }))
      .toEqual({ kind: 'global' });
  });

  it('rejects unsupported precision values at runtime', () => {
    expect(() => validateLocationPrecisionPolicy({ publicPrecision: 'country' })).not.toThrow();
    expect(() => validateLocationPrecisionPolicy({ publicPrecision: 'invalid' as never })).toThrow('publicPrecision');
  });
});

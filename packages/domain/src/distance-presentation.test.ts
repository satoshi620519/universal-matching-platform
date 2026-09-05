import { describe, expect, it } from 'vitest';
import { convertDistanceMeters, validateDistancePresentationPolicy } from './distance-presentation.js';

describe('distance presentation policy', () => {
  it('converts metric and imperial distances from meters', () => {
    expect(convertDistanceMeters(1000, { unit: 'metric' })).toBe(1);
    expect(convertDistanceMeters(1609.344, { unit: 'imperial' })).toBeCloseTo(1);
  });

  it('rejects unsupported units', () => {
    expect(() => validateDistancePresentationPolicy({ unit: 'nautical' as never })).toThrow('distance unit must be metric or imperial');
  });
});

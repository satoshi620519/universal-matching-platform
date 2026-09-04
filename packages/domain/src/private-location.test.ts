import { describe, expect, it } from 'vitest';
import {
  calculateDistanceMeters,
  createPrivateLocation,
  isWithinDistance,
  validateDistanceConstraint,
} from './private-location.js';

describe('private location', () => {
  it('validates latitude and longitude bounds', () => {
    expect(createPrivateLocation({ latitude: 35.681236, longitude: 139.767125 }))
      .toEqual({ latitude: 35.681236, longitude: 139.767125 });
    expect(() => createPrivateLocation({ latitude: -91, longitude: 0 })).toThrow('latitude');
    expect(() => createPrivateLocation({ latitude: 0, longitude: 181 })).toThrow('longitude');
    expect(() => createPrivateLocation({ latitude: Number.NaN, longitude: 0 })).toThrow('finite');
  });

  it('calculates zero distance for the same point', () => {
    const location = { latitude: 35.681236, longitude: 139.767125 };
    expect(calculateDistanceMeters(location, location)).toBe(0);
  });

  it('supports a replaceable distance constraint without exposing coordinates', () => {
    const subject = { latitude: 35.681236, longitude: 139.767125 };
    const nearby = { latitude: 35.682, longitude: 139.768 };
    expect(isWithinDistance(subject, nearby, { maxDistanceMeters: 200 })).toBe(true);
    expect(isWithinDistance(subject, nearby, { maxDistanceMeters: 1 })).toBe(false);
  });

  it('rejects invalid distance constraints', () => {
    expect(() => validateDistanceConstraint({ maxDistanceMeters: 0 })).not.toThrow();
    expect(() => validateDistanceConstraint({ maxDistanceMeters: -1 })).toThrow('maxDistanceMeters');
    expect(() => validateDistanceConstraint({ maxDistanceMeters: Number.NaN })).toThrow('maxDistanceMeters');
  });
});

import { describe, expect, it } from 'vitest';
import { VerificationAccessController } from './verification-access.controller.js';
import { VerificationAccessService } from './verification-access.service.js';

describe('verification access API boundary', () => {
  const controller = new VerificationAccessController(
    new VerificationAccessService(),
  );

  it('rejects an invalid verification level at the HTTP boundary', () => {
    expect(() => controller.evaluate({ level: '9', status: 'verified' })).toThrow();
  });

  it('rejects an invalid verification status at the HTTP boundary', () => {
    expect(() => controller.evaluate({ level: '1', status: 'unknown' })).toThrow();
  });

  it('rejects an invalid date-time at the HTTP boundary', () => {
    expect(() => controller.evaluate({ level: '1', status: 'verified', expiresAt: 'not-a-date' })).toThrow();
  });

  it('returns a usable decision through the existing service', () => {
    expect(
      controller.evaluate({
        level: '2',
        status: 'verified',
        now: '2026-02-01T00:00:00.000Z',
      }),
    ).toEqual({ usable: true, reason: 'usable' });
  });

  it('returns an expired decision without duplicating verification rules', () => {
    expect(
      controller.evaluate({
        level: '2',
        status: 'verified',
        expiresAt: '2026-01-31T00:00:00.000Z',
        now: '2026-02-01T00:00:00.000Z',
      }),
    ).toEqual({ usable: false, reason: 'expired' });
  });
});

import { describe, expect, it } from 'vitest';
import { VerificationAccessService } from './verification-access.service.js';

describe('VerificationAccessService', () => {
  const service = new VerificationAccessService();
  const now = '2026-02-01T00:00:00.000Z';

  it('accepts a usable verified record', () => {
    expect(service.evaluate({ level: 2, status: 'verified' }, now)).toEqual({
      usable: true,
      reason: 'usable',
    });
  });

  it('reports verified records past their expiry as expired', () => {
    expect(
      service.evaluate(
        { level: 2, status: 'verified', expiresAt: '2026-01-31T00:00:00.000Z' },
        now,
      ),
    ).toEqual({ usable: false, reason: 'expired' });
  });

  it('reports non-verified records as unusable without duplicating domain rules', () => {
    expect(service.evaluate({ level: 2, status: 'pending' }, now)).toEqual({
      usable: false,
      reason: 'not-verified',
    });
  });
});

import { describe, expect, it } from 'vitest';

import { VerificationLevelAccessService } from './verification-level-access.service.js';

describe('VerificationLevelAccessService', () => {
  const service = new VerificationLevelAccessService();

  it('allows a usable record at the required level', () => {
    expect(
      service.evaluate(2, {
        level: 2,
        status: 'verified',
      }),
    ).toEqual({
      allowed: true,
      reason: 'sufficient-level',
      requiredLevel: 2,
      actualLevel: 2,
    });
  });

  it('allows a usable record above the required level', () => {
    expect(
      service.evaluate(1, {
        level: 3,
        status: 'verified',
      }),
    ).toMatchObject({ allowed: true, reason: 'sufficient-level' });
  });

  it('rejects an insufficient usable level', () => {
    expect(
      service.evaluate(3, {
        level: 2,
        status: 'verified',
      }),
    ).toEqual({
      allowed: false,
      reason: 'insufficient-level',
      requiredLevel: 3,
      actualLevel: 2,
    });
  });

  it('rejects missing usable verification', () => {
    expect(service.evaluate(1, null)).toEqual({
      allowed: false,
      reason: 'not-usable',
      requiredLevel: 1,
      actualLevel: null,
    });
  });
});

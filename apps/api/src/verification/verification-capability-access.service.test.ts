import { describe, expect, it, vi } from 'vitest';

import { VerificationCapabilityAccessService } from './verification-capability-access.service.js';
import { VerificationLevelAccessService } from './verification-level-access.service.js';
import { VerificationService } from './verification.service.js';

describe('VerificationCapabilityAccessService', () => {
  it('evaluates a protected capability from the account verification outcome', async () => {
    const verificationService = {
      findUsableRecordForAccount: vi.fn().mockResolvedValue({
        level: 2,
        status: 'verified',
      }),
    } as unknown as VerificationService;
    const levelAccessService = new VerificationLevelAccessService();
    const service = new VerificationCapabilityAccessService(
      verificationService,
      levelAccessService,
    );

    await expect(
      service.evaluate({
        accountId: 'account-1',
        requiredLevel: 2,
        now: '2026-08-31T00:00:00.000Z',
      }),
    ).resolves.toMatchObject({
      allowed: true,
      reason: 'sufficient-level',
    });

    expect(
      verificationService.findUsableRecordForAccount,
    ).toHaveBeenCalledWith('account-1', '2026-08-31T00:00:00.000Z');
  });

  it('denies the capability when no usable verification exists', async () => {
    const verificationService = {
      findUsableRecordForAccount: vi.fn().mockResolvedValue(null),
    } as unknown as VerificationService;
    const service = new VerificationCapabilityAccessService(
      verificationService,
      new VerificationLevelAccessService(),
    );

    await expect(
      service.evaluate({
        accountId: 'account-1',
        requiredLevel: 1,
        now: '2026-08-31T00:00:00.000Z',
      }),
    ).resolves.toMatchObject({
      allowed: false,
      reason: 'not-usable',
    });
  });
});

import { describe, expect, it, vi } from 'vitest';

import { VerificationRepository } from './verification.repository.js';
import { VerificationService } from './verification.service.js';

describe('VerificationService', () => {
  it('starts provider-neutral verification requests as pending', async () => {
    const repository = {
      createRequest: vi.fn().mockResolvedValue({ id: 'request-1' }),
      findLatestOutcomeForAccount: vi.fn(),
    } as unknown as VerificationRepository;
    const service = new VerificationService(repository);

    await service.start({
      accountId: 'account-1',
      requestedLevel: 2,
      workflowReference: 'workflow-ref',
    });

    expect(repository.createRequest).toHaveBeenCalledWith({
      accountId: 'account-1',
      requestedLevel: 2,
      workflowReference: 'workflow-ref',
      status: 'pending',
      expiresAt: undefined,
    });
  });

  it('returns a usable verified record', async () => {
    const repository = {
      createRequest: vi.fn(),
      findLatestOutcomeForAccount: vi.fn().mockResolvedValue({
        id: 'outcome-1',
        verificationRequestId: 'request-1',
        level: 2,
        status: 'verified',
        decidedAt: new Date('2026-01-01T00:00:00.000Z'),
        reasonCategory: null,
        expiresAt: new Date('2027-01-01T00:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as VerificationRepository;
    const service = new VerificationService(repository);

    await expect(
      service.findUsableRecordForAccount('account-1', '2026-06-01T00:00:00.000Z'),
    ).resolves.toMatchObject({ level: 2, status: 'verified' });
  });

  it('rejects expired outcomes through domain rules', async () => {
    const repository = {
      createRequest: vi.fn(),
      findLatestOutcomeForAccount: vi.fn().mockResolvedValue({
        id: 'outcome-1',
        verificationRequestId: 'request-1',
        level: 2,
        status: 'verified',
        decidedAt: new Date('2025-01-01T00:00:00.000Z'),
        reasonCategory: null,
        expiresAt: new Date('2026-01-01T00:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as VerificationRepository;
    const service = new VerificationService(repository);

    await expect(
      service.findUsableRecordForAccount('account-1', '2026-06-01T00:00:00.000Z'),
    ).resolves.toBeNull();
  });
});

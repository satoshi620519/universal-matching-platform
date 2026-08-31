import { describe, expect, it, vi } from 'vitest';

import { PrismaVerificationRepository } from './prisma-verification.repository.js';

describe('PrismaVerificationRepository', () => {
  it('creates a provider-neutral verification request', async () => {
    const create = vi.fn().mockResolvedValue({
      id: 'request-1',
      accountId: 'account-1',
      requestedLevel: 2,
      workflowReference: 'workflow-ref',
      status: 'pending',
      createdAt: new Date(),
      completedAt: null,
      expiresAt: null,
    });

    const repository = new PrismaVerificationRepository({
      verificationRequest: { create },
    } as never);

    await repository.createRequest({
      accountId: 'account-1',
      requestedLevel: 2,
      workflowReference: 'workflow-ref',
      status: 'pending',
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        accountId: 'account-1',
        requestedLevel: 2,
        workflowReference: 'workflow-ref',
        status: 'pending',
        expiresAt: undefined,
      },
    });
  });

  it('looks up the latest outcome for an account', async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const repository = new PrismaVerificationRepository({
      verificationOutcome: { findFirst },
    } as never);

    await expect(
      repository.findLatestOutcomeForAccount('account-1'),
    ).resolves.toBeNull();

    expect(findFirst).toHaveBeenCalledWith({
      where: { verificationRequest: { accountId: 'account-1' } },
      orderBy: [{ decidedAt: 'desc' }, { createdAt: 'desc' }],
    });
  });
});

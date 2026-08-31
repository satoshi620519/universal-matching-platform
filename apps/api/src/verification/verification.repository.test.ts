import { describe, expect, it } from 'vitest';

import type { VerificationRepository } from './verification.repository.js';

describe('VerificationRepository contract', () => {
  it('exposes request creation and outcome lookup without provider evidence types', () => {
    const repository: Pick<
      VerificationRepository,
      'createRequest' | 'findLatestOutcomeForAccount'
    > = {
      createRequest: async () => ({
        id: 'request-1',
        accountId: 'account-1',
        requestedLevel: 2,
        workflowReference: 'workflow-ref',
        status: 'pending',
        createdAt: new Date(),
        completedAt: null,
        expiresAt: null,
      }),
      findLatestOutcomeForAccount: async () => null,
    };

    expect(typeof repository.createRequest).toBe('function');
    expect(typeof repository.findLatestOutcomeForAccount).toBe('function');
  });
});

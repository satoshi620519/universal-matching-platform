import { describe, expect, it } from 'vitest';

import {
  VerificationProvider,
  type VerificationProviderOutcome,
  type VerificationProviderRequest,
} from './verification-provider.js';

class FakeVerificationProvider extends VerificationProvider {
  async createVerification(
    _input: VerificationProviderRequest,
  ): Promise<{ readonly providerReference: string }> {
    return { providerReference: 'provider-request-1' };
  }

  async getOutcome(_providerReference: string): Promise<VerificationProviderOutcome | null> {
    return {
      providerReference: 'provider-request-1',
      status: 'verified',
      level: 2,
    };
  }
}

describe('VerificationProvider', () => {
  it('keeps provider operations behind the provider-neutral contract', async () => {
    const provider = new FakeVerificationProvider();

    await expect(
      provider.createVerification({
        requestId: 'request-1',
        accountId: 'account-1',
        level: 2,
        workflowReference: 'workflow-1',
      }),
    ).resolves.toEqual({ providerReference: 'provider-request-1' });

    await expect(provider.getOutcome('provider-request-1')).resolves.toMatchObject({
      status: 'verified',
      level: 2,
    });
  });

  it('allows a provider to report no outcome yet', async () => {
    class PendingProvider extends VerificationProvider {
      async createVerification(): Promise<{ readonly providerReference: string }> {
        return { providerReference: 'pending-1' };
      }

      async getOutcome(): Promise<VerificationProviderOutcome | null> {
        return null;
      }
    }

    await expect(new PendingProvider().getOutcome('pending-1')).resolves.toBeNull();
  });
});

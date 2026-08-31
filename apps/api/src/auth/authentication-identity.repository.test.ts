import { describe, expect, it } from 'vitest';

import type { AuthenticationIdentityRepository } from './authentication-identity.repository.js';

describe('authentication identity repository contract', () => {
  it('keeps provider identity persistence independent from Prisma model types', () => {
    const contract: Pick<
      AuthenticationIdentityRepository,
      'create' | 'findByProviderIdentity' | 'updateStatus'
    > = {
      create: async () => ({
        id: '00000000-0000-0000-0000-000000000002',
        accountId: '00000000-0000-0000-0000-000000000001',
        providerType: 'email',
        providerSubject: 'user@example.test',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findByProviderIdentity: async () => null,
      updateStatus: async () => null,
    };

    expect(typeof contract.create).toBe('function');
    expect(typeof contract.findByProviderIdentity).toBe('function');
    expect(typeof contract.updateStatus).toBe('function');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';

import { DuplicateAuthenticationIdentityError } from './duplicate-authentication-identity.error.js';
import { PrismaPasswordRegistrationRepository } from './prisma-password-registration.repository.js';

describe('PrismaPasswordRegistrationRepository duplicate mapping', () => {
  it('maps P2002 uniqueness failures to a stable application error', async () => {
    const duplicate = new Prisma.PrismaClientKnownRequestError('duplicate', {
      code: 'P2002',
      clientVersion: 'test',
    });
    const database = {
      $transaction: vi.fn().mockRejectedValue(duplicate),
    } as any;

    const repository = new PrismaPasswordRegistrationRepository(database);

    await expect(repository.create({
      accountStatus: 'pending-onboarding',
      providerType: 'email-password',
      providerSubject: 'user@example.test',
      passwordHash: 'opaque-hash',
    })).rejects.toBeInstanceOf(DuplicateAuthenticationIdentityError);
  });
});

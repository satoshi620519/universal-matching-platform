import { describe, expect, it, vi } from 'vitest';

import { PrismaPasswordCredentialRepository } from './prisma-password-credential.repository.js';

describe('PrismaPasswordCredentialRepository', () => {
  const createdAt = new Date('2026-08-31T00:00:00.000Z');
  const record = {
    authenticationIdentityId: 'identity-1',
    passwordHash: 'opaque-hash',
    status: 'active',
    createdAt,
    updatedAt: createdAt,
  };

  function database(overrides: Record<string, unknown> = {}) {
    return {
      passwordCredential: {
        create: vi.fn().mockResolvedValue(record),
        findUnique: vi.fn().mockResolvedValue(record),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        ...overrides,
      },
    } as any;
  }

  it('creates credentials with active as the default status', async () => {
    const db = database();
    const repository = new PrismaPasswordCredentialRepository(db);

    await expect(repository.create({
      authenticationIdentityId: 'identity-1',
      passwordHash: 'opaque-hash',
    })).resolves.toMatchObject({ status: 'active' });

    expect(db.passwordCredential.create).toHaveBeenCalledWith({
      data: {
        authenticationIdentityId: 'identity-1',
        passwordHash: 'opaque-hash',
        status: 'active',
      },
    });
  });

  it('returns null when no credential exists', async () => {
    const db = database({ findUnique: vi.fn().mockResolvedValue(null) });
    const repository = new PrismaPasswordCredentialRepository(db);

    await expect(repository.findByAuthenticationIdentityId('missing')).resolves.toBeNull();
  });

  it('returns null without a follow-up lookup when hash replacement matches nothing', async () => {
    const findUnique = vi.fn();
    const db = database({
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
      findUnique,
    });
    const repository = new PrismaPasswordCredentialRepository(db);

    await expect(repository.replacePasswordHash('missing', 'new-hash')).resolves.toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('replaces a hash through identity-scoped persistence', async () => {
    const db = database();
    const repository = new PrismaPasswordCredentialRepository(db);

    await repository.replacePasswordHash('identity-1', 'new-hash');

    expect(db.passwordCredential.updateMany).toHaveBeenCalledWith({
      where: { authenticationIdentityId: 'identity-1' },
      data: { passwordHash: 'new-hash' },
    });
  });

  it('updates status and reports missing credentials', async () => {
    const db = database({ updateMany: vi.fn().mockResolvedValue({ count: 0 }) });
    const repository = new PrismaPasswordCredentialRepository(db);

    await expect(repository.updateStatus('missing', 'disabled')).resolves.toBeNull();
  });
});

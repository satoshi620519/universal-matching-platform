import { describe, expect, it, vi } from 'vitest';

import { PrismaPasswordRecoveryRepository } from './prisma-password-recovery.repository.js';

describe('PrismaPasswordRecoveryRepository', () => {
  const requestedAt = new Date('2026-09-04T00:00:00.000Z');
  const expiresAt = new Date('2026-09-04T01:00:00.000Z');
  const record = {
    id: 'recovery-1',
    authenticationIdentityId: 'identity-1',
    secretHash: 'opaque-secret-hash',
    status: 'active',
    requestedAt,
    expiresAt,
    consumedAt: null,
    revokedAt: null,
  };

  function database(overrides: Record<string, unknown> = {}) {
    return {
      passwordRecoveryRequest: {
        create: vi.fn().mockResolvedValue(record),
        findUnique: vi.fn().mockResolvedValue(record),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        ...overrides,
      },
    } as any;
  }

  it('creates a recovery request with the expected persistence shape', async () => {
    const db = database();
    const repository = new PrismaPasswordRecoveryRepository(db);

    await expect(repository.create(record)).resolves.toMatchObject({
      id: 'recovery-1',
      status: 'active',
    });

    expect(db.passwordRecoveryRequest.create).toHaveBeenCalledWith({
      data: {
        id: record.id,
        authenticationIdentityId: record.authenticationIdentityId,
        secretHash: record.secretHash,
        status: record.status,
        requestedAt,
        expiresAt,
      },
    });
  });

  it('returns null when a recovery request does not exist', async () => {
    const db = database({ findUnique: vi.fn().mockResolvedValue(null) });
    const repository = new PrismaPasswordRecoveryRepository(db);

    await expect(repository.findById('missing')).resolves.toBeNull();
  });

  it('consumes only an active unconsumed and unrevoked request', async () => {
    const db = database();
    const repository = new PrismaPasswordRecoveryRepository(db);
    const consumedAt = new Date('2026-09-04T00:30:00.000Z');

    await repository.consume('recovery-1', consumedAt);

    expect(db.passwordRecoveryRequest.updateMany).toHaveBeenCalledWith({
      where: { id: 'recovery-1', status: 'active', consumedAt: null, revokedAt: null },
      data: { status: 'consumed', consumedAt },
    });
  });

  it('revokes all active requests for an authentication identity', async () => {
    const db = database();
    const repository = new PrismaPasswordRecoveryRepository(db);
    const revokedAt = new Date('2026-09-04T00:30:00.000Z');

    await repository.revokeActiveForAuthenticationIdentity('identity-1', revokedAt);

    expect(db.passwordRecoveryRequest.updateMany).toHaveBeenCalledWith({
      where: { authenticationIdentityId: 'identity-1', status: 'active', revokedAt: null },
      data: { status: 'revoked', revokedAt },
    });
  });
});

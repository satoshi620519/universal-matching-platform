import { describe, expect, it, vi } from 'vitest';

import { PrismaAuditRecordRepository } from './prisma-audit-record.repository.js';

describe('PrismaAuditRecordRepository', () => {
  it('persists a privileged moderation audit record through the auditRecord table adapter', async () => {
    const occurredAt = new Date('2026-09-03T00:00:00.000Z');
    const create = vi.fn().mockResolvedValue({
      id: 'audit-1',
      actorId: 'moderator-1',
      area: 'moderation',
      action: 'action.suspend',
      targetId: 'target-1',
      correlationId: 'corr-1',
      occurredAt,
    });
    const repository = new PrismaAuditRecordRepository({ auditRecord: { create } } as any);

    await expect(
      repository.append({
        actorId: 'moderator-1',
        area: 'moderation',
        action: 'action.suspend',
        targetId: 'target-1',
        correlationId: 'corr-1',
        occurredAt,
      }),
    ).resolves.toEqual({
      id: 'audit-1',
      actorId: 'moderator-1',
      area: 'moderation',
      action: 'action.suspend',
      targetId: 'target-1',
      occurredAt: occurredAt.toISOString(),
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        actorId: 'moderator-1',
        area: 'moderation',
        action: 'action.suspend',
        targetId: 'target-1',
        correlationId: 'corr-1',
        occurredAt,
      },
    });
  });
});

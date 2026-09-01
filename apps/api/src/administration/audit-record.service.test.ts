import { describe, expect, it, vi } from 'vitest';

import { AuditRecordService } from './audit-record.service.js';

describe('AuditRecordService', () => {
  it('appends validated, data-minimized audit records', async () => {
    const append = vi.fn().mockResolvedValue({ id: 'audit-1' });
    const service = new AuditRecordService({ append } as any);

    await service.append({
      actorId: 'operator-1',
      area: 'security',
      action: 'requeue-failed-email',
      targetId: 'outbox-1',
      occurredAt: '2026-09-01T00:00:00.000Z',
      correlationId: 'corr-1',
    });

    expect(append).toHaveBeenCalledWith({
      actorId: 'operator-1',
      area: 'security',
      action: 'requeue-failed-email',
      targetId: 'outbox-1',
      correlationId: 'corr-1',
      occurredAt: new Date('2026-09-01T00:00:00.000Z'),
    });
  });

  it('rejects invalid audit records before persistence', async () => {
    const append = vi.fn();
    const service = new AuditRecordService({ append } as any);
    await expect(service.append({
      actorId: ' ', area: 'security', action: 'x',
      occurredAt: '2026-09-01T00:00:00.000Z',
    })).rejects.toThrow('Invalid audit record');
    expect(append).not.toHaveBeenCalled();
  });
});

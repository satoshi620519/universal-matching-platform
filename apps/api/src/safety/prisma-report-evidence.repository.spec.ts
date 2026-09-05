import { describe, expect, it, vi } from 'vitest';
import { PrismaReportEvidenceRepository } from './prisma-report-evidence.repository.js';

describe('PrismaReportEvidenceRepository', () => {
  it('persists canonical evidence metadata', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'e1', reportId: 'r1', kind: 'text-context', context: 'details', reference: null, capturedAt: new Date('2026-09-05T00:00:00.000Z') });
    const repository = new PrismaReportEvidenceRepository({ reportEvidence: { create, findMany: vi.fn() } } as never);

    await expect(repository.create({ id: 'e1', reportId: 'r1', kind: 'text-context', context: 'details', reference: null, capturedAt: '2026-09-05T00:00:00.000Z' })).resolves.toEqual({ id: 'e1', reportId: 'r1', kind: 'text-context', context: 'details', reference: null, capturedAt: '2026-09-05T00:00:00.000Z' });
    expect(create).toHaveBeenCalledWith({ data: { id: 'e1', reportId: 'r1', kind: 'text-context', context: 'details', reference: null, capturedAt: new Date('2026-09-05T00:00:00.000Z') } });
  });

  it('isolates reports and requests deterministic chronological ordering', async () => {
    const findMany = vi.fn().mockResolvedValue([
      { id: 'e1', reportId: 'r1', kind: 'text-context', context: 'first', reference: null, capturedAt: new Date('2026-09-05T00:00:00.000Z') },
    ]);
    const repository = new PrismaReportEvidenceRepository({ reportEvidence: { create: vi.fn(), findMany } } as never);

    await expect(repository.listForReport('r1')).resolves.toHaveLength(1);
    expect(findMany).toHaveBeenCalledWith({ where: { reportId: 'r1' }, orderBy: [{ capturedAt: 'asc' }, { id: 'asc' }] });
  });
});

import { describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { SafetyModerationService } from './safety-moderation.service.js';

describe('SafetyModerationService evidence capture', () => {
  const service = (report: unknown) => {
    const reports = { findById: vi.fn().mockResolvedValue(report) };
    const evidence = { create: vi.fn().mockImplementation(async (value) => value) };
    const instance = new SafetyModerationService(reports as never, evidence as never, {} as never, {} as never, {} as never);
    return { instance, reports, evidence };
  };

  it('captures evidence only for the report owner', async () => {
    const { instance, evidence } = service({ id: 'r1', reporterId: 'owner-1' });
    await expect(instance.captureReportEvidence({ reporterId: 'owner-1', reportId: 'r1', id: 'e1', kind: 'text-context', context: 'details' })).resolves.toMatchObject({ id: 'e1', reportId: 'r1' });
    expect(evidence.create).toHaveBeenCalledTimes(1);
  });

  it('hides missing or foreign reports and does not write evidence', async () => {
    const missing = service(null);
    await expect(missing.instance.captureReportEvidence({ reporterId: 'owner-1', reportId: 'missing', id: 'e1', kind: 'text-context', context: 'details' })).rejects.toBeInstanceOf(NotFoundException);
    expect(missing.evidence.create).not.toHaveBeenCalled();

    const foreign = service({ id: 'r2', reporterId: 'other-1' });
    await expect(foreign.instance.captureReportEvidence({ reporterId: 'owner-1', reportId: 'r2', id: 'e2', kind: 'text-context', context: 'details' })).rejects.toBeInstanceOf(NotFoundException);
    expect(foreign.evidence.create).not.toHaveBeenCalled();
  });
});

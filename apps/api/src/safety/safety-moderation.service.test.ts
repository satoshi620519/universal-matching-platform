import { describe, expect, it, vi } from 'vitest';

import { SafetyModerationService } from './safety-moderation.service.js';

describe('SafetyModerationService authorization', () => {
  it('denies every privileged moderation operation before touching moderation repositories', async () => {
    const deny = vi.fn().mockRejectedValue(new Error('administrative capability is required'));
    const reports = {
      findById: vi.fn(),
      findCaseByReportId: vi.fn(),
      transitionReport: vi.fn(),
      createCase: vi.fn(),
      transitionCase: vi.fn(),
    };
    const enforcement = { create: vi.fn() };
    const audit = { append: vi.fn() };
    const service = new SafetyModerationService(
      reports as any,
      enforcement as any,
      { require: deny } as any,
      audit as any,
    );

    await expect(
      service.transitionReport({
        actorId: 'unprivileged-account',
        reportId: 'report-1',
        status: 'triaged',
      }),
    ).rejects.toThrow('administrative capability is required');

    await expect(
      service.openCase({ actorId: 'unprivileged-account', reportId: 'report-1' }),
    ).rejects.toThrow('administrative capability is required');

    await expect(
      service.transitionCase({
        actorId: 'unprivileged-account',
        caseId: 'case-1',
        status: 'under-review',
      }),
    ).rejects.toThrow('administrative capability is required');

    await expect(
      service.applyAction({
        actorId: 'unprivileged-account',
        caseId: 'case-1',
        targetId: 'target-1',
        action: 'warning',
        reasonCategory: 'test',
      }),
    ).rejects.toThrow('administrative capability is required');

    expect(deny).toHaveBeenCalledTimes(4);
    expect(deny).toHaveBeenNthCalledWith(1, 'unprivileged-account', 'manage-moderation');
    expect(deny).toHaveBeenNthCalledWith(2, 'unprivileged-account', 'manage-moderation');
    expect(deny).toHaveBeenNthCalledWith(3, 'unprivileged-account', 'manage-moderation');
    expect(deny).toHaveBeenNthCalledWith(4, 'unprivileged-account', 'manage-moderation');
    expect(reports.findById).not.toHaveBeenCalled();
    expect(reports.findCaseByReportId).not.toHaveBeenCalled();
    expect(reports.transitionReport).not.toHaveBeenCalled();
    expect(reports.createCase).not.toHaveBeenCalled();
    expect(reports.transitionCase).not.toHaveBeenCalled();
    expect(enforcement.create).not.toHaveBeenCalled();
    expect(audit.append).not.toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { SafetyModerationService } from './safety-moderation.service.js';

describe('SafetyModerationService moderation queue', () => {
  it('requires moderation capability and forwards only canonical queue parameters', async () => {
    const reports = { listForModeration: vi.fn().mockResolvedValue([{ id: 'r1' }]) };
    const admin = { require: vi.fn().mockResolvedValue(undefined) };
    const service = new SafetyModerationService(reports as never, {} as never, {} as never, admin as never, {} as never);

    await expect(service.listModerationQueue({ actorId: 'admin-1', status: 'submitted', limit: 25 })).resolves.toEqual([{ id: 'r1' }]);
    expect(admin.require).toHaveBeenCalledWith('admin-1', 'manage-moderation');
    expect(reports.listForModeration).toHaveBeenCalledWith('submitted', 25);
  });

  it('does not read the queue when authorization fails', async () => {
    const reports = { listForModeration: vi.fn() };
    const admin = { require: vi.fn().mockRejectedValue(new Error('forbidden')) };
    const service = new SafetyModerationService(reports as never, {} as never, {} as never, admin as never, {} as never);

    await expect(service.listModerationQueue({ actorId: 'user-1' })).rejects.toThrow('forbidden');
    expect(reports.listForModeration).not.toHaveBeenCalled();
  });
});

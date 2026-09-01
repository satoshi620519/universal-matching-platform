import { describe, expect, it, vi } from 'vitest';

import { PrivilegedFailedEmailOutboxService } from './privileged-failed-email-outbox.service.js';

describe('PrivilegedFailedEmailOutboxService', () => {
  it('authorizes before listing and audits successful privileged review', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const review = { list: vi.fn().mockResolvedValue([]), requeue: vi.fn() };
    const audit = { append: vi.fn().mockResolvedValue(undefined) };
    const service = new PrivilegedFailedEmailOutboxService(access as any, review as any, audit as any);

    await service.list('moderator-1', 10);

    expect(access.require).toHaveBeenCalledWith('moderator-1', 'review-failed-email-outbox');
    expect(review.list).toHaveBeenCalledWith(10);
    expect(audit.append).toHaveBeenCalledWith(expect.objectContaining({
      actorId: 'moderator-1', action: 'review-failed-email-outbox',
    }));
  });

  it('does not review or audit when authorization fails', async () => {
    const access = { require: vi.fn().mockRejectedValue(new Error('forbidden')) };
    const review = { list: vi.fn(), requeue: vi.fn() };
    const audit = { append: vi.fn() };
    const service = new PrivilegedFailedEmailOutboxService(access as any, review as any, audit as any);

    await expect(service.list('user-1')).rejects.toThrow('forbidden');
    expect(review.list).not.toHaveBeenCalled();
    expect(audit.append).not.toHaveBeenCalled();
  });

  it('audits a successful requeue but not a no-op requeue', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const review = { list: vi.fn(), requeue: vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false) };
    const audit = { append: vi.fn().mockResolvedValue(undefined) };
    const service = new PrivilegedFailedEmailOutboxService(access as any, review as any, audit as any);

    await expect(service.requeue('moderator-1', 'outbox-1')).resolves.toBe(true);
    await expect(service.requeue('moderator-1', 'outbox-2')).resolves.toBe(false);
    expect(audit.append).toHaveBeenCalledTimes(1);
    expect(audit.append).toHaveBeenCalledWith(expect.objectContaining({
      actorId: 'moderator-1', action: 'requeue-failed-email', targetId: 'outbox-1',
    }));
  });
});

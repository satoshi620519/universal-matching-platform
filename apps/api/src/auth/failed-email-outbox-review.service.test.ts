import { describe, expect, it, vi } from 'vitest';

import { FailedEmailOutboxReviewService } from './failed-email-outbox-review.service.js';

describe('FailedEmailOutboxReviewService', () => {
  it('lists only through the failed-message boundary with a bounded limit', async () => {
    const listFailed = vi.fn().mockResolvedValue([]);
    const service = new FailedEmailOutboxReviewService({ listFailed } as any);

    await service.list();
    expect(listFailed).toHaveBeenCalledWith({ limit: 50 });
    await expect(service.list(101)).rejects.toThrow('limit must be an integer between 1 and 100');
  });

  it('requeues through the guarded terminal transition boundary', async () => {
    const requeueFailed = vi.fn().mockResolvedValue(true);
    const service = new FailedEmailOutboxReviewService({ requeueFailed } as any);

    await expect(service.requeue('outbox-1')).resolves.toBe(true);
    expect(requeueFailed).toHaveBeenCalledWith(
      'outbox-1',
      expect.objectContaining({ availableAt: expect.any(Date) }),
    );
  });
});

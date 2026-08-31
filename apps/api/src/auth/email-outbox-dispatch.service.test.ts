import { describe, expect, it, vi } from 'vitest';

import { EmailOutboxDispatchService } from './email-outbox-dispatch.service.js';

describe('EmailOutboxDispatchService', () => {
  it('delivers and marks a claimed verification message', async () => {
    const claimNext = vi.fn().mockResolvedValue({
      id: 'outbox-1',
      accountId: 'account-1',
      emailAddress: 'user@example.test',
      kind: 'email-verification',
      attempts: 1,
    });
    const markDelivered = vi.fn().mockResolvedValue(undefined);
    const service = new EmailOutboxDispatchService(
      { claimNext, markDelivered } as any,
      { issueAndDeliver: vi.fn().mockResolvedValue(undefined) } as any,
    );

    await expect(service.dispatchOne()).resolves.toBe(true);
    expect(markDelivered).toHaveBeenCalledWith('outbox-1', expect.any(Date));
  });

  it('reschedules failures with a bounded retry delay', async () => {
    const reschedule = vi.fn().mockResolvedValue(undefined);
    const service = new EmailOutboxDispatchService(
      {
        claimNext: vi.fn().mockResolvedValue({
          id: 'outbox-1', accountId: 'account-1',
          emailAddress: 'user@example.test', kind: 'email-verification', attempts: 2,
        }),
        reschedule,
      } as any,
      { issueAndDeliver: vi.fn().mockRejectedValue(new Error('provider unavailable')) } as any,
    );

    await expect(service.dispatchOne()).resolves.toBe(false);
    expect(reschedule).toHaveBeenCalledWith('outbox-1', expect.objectContaining({
      error: 'provider unavailable',
      availableAt: expect.any(Date),
    }));
  });
});

import { describe, expect, it, vi } from 'vitest';

import { EmailOutboxProcessService } from './email-outbox-process.service.js';

describe('EmailOutboxProcessService', () => {
  it('drains a bounded batch and returns timing metadata', async () => {
    const drain = vi.fn().mockResolvedValue(3);
    const service = new EmailOutboxProcessService({ drain } as any);

    const result = await service.runBatch(10);

    expect(drain).toHaveBeenCalledWith(10);
    expect(result.processed).toBe(3);
    expect(result.finishedAt.getTime()).toBeGreaterThanOrEqual(result.startedAt.getTime());
  });
});

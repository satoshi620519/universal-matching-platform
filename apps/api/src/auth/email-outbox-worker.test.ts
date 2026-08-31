import { describe, expect, it, vi } from 'vitest';

import { EmailOutboxWorker } from './email-outbox-worker.js';

describe('EmailOutboxWorker', () => {
  it('runs one dispatch explicitly', async () => {
    const dispatchOne = vi.fn().mockResolvedValue(true);
    const worker = new EmailOutboxWorker({ dispatchOne } as any);

    await expect(worker.runOnce()).resolves.toBe(true);
    expect(dispatchOne).toHaveBeenCalledTimes(1);
  });

  it('drains only up to the configured bound', async () => {
    const dispatchOne = vi
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);
    const worker = new EmailOutboxWorker({ dispatchOne } as any);

    await expect(worker.drain(2)).resolves.toBe(2);
    expect(dispatchOne).toHaveBeenCalledTimes(2);
  });

  it('stops draining when no message is available', async () => {
    const dispatchOne = vi
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const worker = new EmailOutboxWorker({ dispatchOne } as any);

    await expect(worker.drain(10)).resolves.toBe(1);
  });
});

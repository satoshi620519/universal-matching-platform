import { describe, expect, it, vi } from 'vitest';
import { createBrowserFailedEmailOutboxApi } from './browser-failed-email-outbox-api';

describe('createBrowserFailedEmailOutboxApi', () => {
  it('lists failed messages through the existing administrative endpoint', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: 'failed-1' }] });
    await expect(createBrowserFailedEmailOutboxApi(fetchImpl as any).list()).resolves.toEqual([{ id: 'failed-1' }]);
    expect(fetchImpl).toHaveBeenCalledWith('/administration/failed-email-outbox?limit=50', expect.any(Object));
  });

  it('requeues a failed message through the existing administrative endpoint', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ requeued: true }) });
    await expect(createBrowserFailedEmailOutboxApi(fetchImpl as any).requeue('failed-1')).resolves.toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith('/administration/failed-email-outbox/failed-1/requeue', expect.objectContaining({ method: 'POST' }));
  });
});

import { describe, expect, it, vi } from 'vitest';
import { OutboxWorker, retryDelayMs, shouldRetry } from './outbox-worker.js';

describe('OutboxWorker', () => {
  it('processes each claimed event once and marks it after successful handling', async () => {
    const store = {
      claim: vi.fn().mockResolvedValue([{ id: 'e1', type: 'message.created', payload: {} }]),
      markProcessed: vi.fn().mockResolvedValue(undefined),
      releaseForRetry: vi.fn(),
    };
    const idempotency = {
      hasProcessed: vi.fn().mockResolvedValue(false),
      markProcessed: vi.fn().mockResolvedValue(undefined),
    };
    const handler = { handle: vi.fn().mockResolvedValue(undefined) };

    const processed = await new OutboxWorker(store, idempotency, handler).runBatch();

    expect(processed).toBe(1);
    expect(handler.handle).toHaveBeenCalledTimes(1);
    expect(idempotency.markProcessed).toHaveBeenCalledWith('e1');
    expect(store.markProcessed).toHaveBeenCalledWith('e1');
    expect(store.releaseForRetry).not.toHaveBeenCalled();
  });

  it('skips duplicate delivery after idempotency has already been recorded', async () => {
    const store = {
      claim: vi.fn().mockResolvedValue([{ id: 'e1', type: 'message.created', payload: {} }]),
      markProcessed: vi.fn().mockResolvedValue(undefined),
      releaseForRetry: vi.fn(),
    };
    const idempotency = { hasProcessed: vi.fn().mockResolvedValue(true), markProcessed: vi.fn() };
    const handler = { handle: vi.fn() };

    await new OutboxWorker(store, idempotency, handler).runBatch();

    expect(handler.handle).not.toHaveBeenCalled();
    expect(store.markProcessed).toHaveBeenCalledWith('e1');
  });

  it('releases failed events for retry without falsely marking them processed', async () => {
    const error = new Error('temporary failure');
    const store = {
      claim: vi.fn().mockResolvedValue([{ id: 'e1', type: 'message.created', payload: {} }]),
      markProcessed: vi.fn(),
      releaseForRetry: vi.fn().mockResolvedValue(undefined),
    };
    const idempotency = { hasProcessed: vi.fn().mockResolvedValue(false), markProcessed: vi.fn() };
    const handler = { handle: vi.fn().mockRejectedValue(error) };

    await expect(new OutboxWorker(store, idempotency, handler).runBatch()).resolves.toBe(0);

    expect(store.releaseForRetry).toHaveBeenCalledWith('e1', error);
    expect(store.markProcessed).not.toHaveBeenCalled();
    expect(idempotency.markProcessed).not.toHaveBeenCalled();
  });

  it('validates worker batch configuration', () => {
    const store = { claim: vi.fn(), markProcessed: vi.fn(), releaseForRetry: vi.fn() };
    const idempotency = { hasProcessed: vi.fn(), markProcessed: vi.fn() };
    const handler = { handle: vi.fn() };
    expect(() => new OutboxWorker(store, idempotency, handler, { batchSize: 0 })).toThrow();
    expect(() => new OutboxWorker(store, idempotency, handler, { maxAttempts: 21 })).toThrow();
  });
});

describe('retry policy', () => {
  it('uses capped exponential backoff', () => {
    expect(retryDelayMs(1)).toBe(1_000);
    expect(retryDelayMs(2)).toBe(2_000);
    expect(retryDelayMs(6)).toBe(32_000);
    expect(retryDelayMs(7)).toBe(60_000);
  });

  it('stops retrying at the configured attempt limit', () => {
    expect(shouldRetry(1, 5)).toBe(true);
    expect(shouldRetry(5, 5)).toBe(false);
  });
});

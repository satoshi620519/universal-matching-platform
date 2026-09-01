import { describe, expect, it, vi } from 'vitest';
import { NoopRealtimePublisher } from './noop-realtime-publisher.js';

describe('NoopRealtimePublisher', () => {
  it('accepts stable account-scoped event envelopes without transport coupling', async () => {
    const publisher = new NoopRealtimePublisher();
    await expect(publisher.publishToAccount('a1', { eventId: 'e1', eventType: 'notification.created', schemaVersion: 1, occurredAt: new Date().toISOString(), resource: { type: 'notification', id: 'n1' }, payload: {} })).resolves.toBeUndefined();
  });
});

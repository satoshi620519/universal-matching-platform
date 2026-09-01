import { describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SseRealtimePublisher } from './sse-realtime-publisher.js';

describe('SseRealtimePublisher', () => {
  it('delivers events only to the targeted account stream', async () => {
    const publisher = new SseRealtimePublisher();
    const first = firstValueFrom(publisher.streamFor('a1'));
    const second = firstValueFrom(publisher.streamFor('a2'));
    const event = { eventId: 'e1', eventType: 'message.created', schemaVersion: 1 as const, occurredAt: new Date().toISOString(), resource: { type: 'message', id: 'm1' }, payload: {} };
    await publisher.publishToAccount('a1', event);
    await expect(first).resolves.toEqual(event);
    expect(await Promise.race([second.then(() => 'received'), new Promise((resolve) => setTimeout(() => resolve('pending'), 10))])).toBe('pending');
  });
});

import { describe, expect, it } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SseRealtimePublisher } from './sse-realtime-publisher.js';

describe('SseRealtimePublisher regression', () => {
  it('returns a usable account stream without recursive accessor calls', async () => {
    const publisher = new SseRealtimePublisher();
    const event = { eventId: 'e1', eventType: 'notification.created', schemaVersion: 1 as const, occurredAt: new Date().toISOString(), resource: { type: 'notification', id: 'n1' }, payload: {} };
    const received = firstValueFrom(publisher.streamFor('a1'));
    await publisher.publishToAccount('a1', event);
    await expect(received).resolves.toEqual(event);
  });
});

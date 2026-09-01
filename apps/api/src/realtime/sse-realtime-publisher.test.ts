import { describe, expect, it } from 'vitest';
import { firstValueFrom, Subject } from 'rxjs';
import { SseRealtimePublisher } from './sse-realtime-publisher.js';

describe('SseRealtimePublisher', () => {
  const event = () => ({ eventId: 'e1', eventType: 'message.created' as const, schemaVersion: 1 as const, occurredAt: new Date().toISOString(), resource: { type: 'message' as const, id: 'm1' }, payload: {} });

  it('delivers events only to the targeted account stream', async () => {
    const publisher = new SseRealtimePublisher();
    const first = firstValueFrom(publisher.streamFor('a1'));
    const second = firstValueFrom(publisher.streamFor('a2'));
    const value = event();
    await publisher.publishToAccount('a1', value);
    await expect(first).resolves.toEqual(value);
    expect(await Promise.race([second.then(() => 'received'), new Promise((resolve) => setTimeout(() => resolve('pending'), 10))])).toBe('pending');
  });

  it('fans out the same committed event to every subscriber of one account', async () => {
    const publisher = new SseRealtimePublisher();
    const first = firstValueFrom(publisher.streamFor('a1'));
    const second = firstValueFrom(publisher.streamFor('a1'));
    const value = event();
    await publisher.publishToAccount('a1', value);
    await expect(Promise.all([first, second])).resolves.toEqual([value, value]);
  });

  it('does not retain a subscriber after it unsubscribes', async () => {
    const publisher = new SseRealtimePublisher();
    const stream = publisher.streamFor('a1');
    const subscription = stream.subscribe();
    subscription.unsubscribe();
    const later = firstValueFrom(stream);
    await publisher.publishToAccount('a1', event());
    await expect(later).resolves.toEqual(expect.objectContaining({ eventType: 'message.created' }));
  });

  it('does not couple transport failure to publication completion', async () => {
    const publisher = new SseRealtimePublisher();
    const stream = publisher.streamFor('a1') as Subject<unknown>;
    expect(stream).toBeDefined();
    await expect(publisher.publishToAccount('a1', event())).resolves.toBeUndefined();
  });
});

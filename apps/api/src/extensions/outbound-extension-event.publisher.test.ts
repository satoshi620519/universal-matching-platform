import { describe, expect, it } from 'vitest';
import { NoopOutboundExtensionEventPublisher } from './noop-outbound-extension-event.publisher.js';

describe('NoopOutboundExtensionEventPublisher', () => {
  it('accepts a versioned public event without leaking implementation requirements', async () => {
    const publisher = new NoopOutboundExtensionEventPublisher();
    await expect(publisher.publish({ id: 'evt-1', type: 'account.lifecycle', schemaVersion: 1, occurredAt: new Date('2026-09-08T00:00:00Z'), correlationId: 'corr-1', payload: { accountId: 'public-id' } })).resolves.toBeUndefined();
  });
});

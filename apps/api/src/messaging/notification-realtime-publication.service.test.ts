import { describe, expect, it, vi } from 'vitest';
import { NotificationRealtimePublicationService } from './notification-realtime-publication.service.js';

describe('NotificationRealtimePublicationService', () => {
  it('publishes each committed notification only to its owning account', async () => {
    const publishToAccount = vi.fn().mockResolvedValue(undefined);
    const service = new NotificationRealtimePublicationService({ publishToAccount } as never);
    await service.publishCreated({ notificationIds: ['n1', 'n2'], recipientAccountIds: ['a1', 'a2'] });
    expect(publishToAccount).toHaveBeenCalledWith('a1', expect.objectContaining({ eventType: 'notification.created', resource: { type: 'notification', id: 'n1' } }));
    expect(publishToAccount).toHaveBeenCalledWith('a2', expect.objectContaining({ eventType: 'notification.created', resource: { type: 'notification', id: 'n2' } }));
  });

  it('rejects misaligned notification and recipient inputs', async () => {
    const service = new NotificationRealtimePublicationService({ publishToAccount: vi.fn() } as never);
    await expect(service.publishCreated({ notificationIds: ['n1'], recipientAccountIds: [] })).rejects.toThrow('align');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { MessageRealtimePublicationService } from './message-realtime-publication.service.js';

describe('MessageRealtimePublicationService', () => {
  it('publishes account-scoped committed message events without becoming a mutation path', async () => {
    const publishToAccount = vi.fn().mockResolvedValue(undefined);
    const service = new MessageRealtimePublicationService({ publishToAccount } as never);
    await service.publishRecipients({
      messageId: 'm1', conversationId: 'c1', senderAccountId: 'a1', recipientAccountIds: ['a2'],
    });
    expect(publishToAccount).toHaveBeenCalledWith('a2', expect.objectContaining({
      eventType: 'message.created', resource: { type: 'message', id: 'm1' },
    }));
  });
});

import { describe, expect, it, vi } from 'vitest';
import { AdministrativeConversationReadService } from './administrative-conversation-read.service.js';

describe('AdministrativeConversationReadService', () => {
  it('requires dashboard access and clamps limits', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const conversations = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const service = new AdministrativeConversationReadService(access as never, conversations as never);
    await service.list({ accountId: 'admin-1', limit: 999 });
    expect(access.require).toHaveBeenCalledWith('admin-1', 'view-dashboard');
    expect(conversations.list).toHaveBeenCalledWith({ cursor: undefined, limit: 100 });
  });

  it('does not query conversations when authorization fails', async () => {
    const access = { require: vi.fn().mockRejectedValue(new Error('denied')) };
    const conversations = { list: vi.fn() };
    const service = new AdministrativeConversationReadService(access as never, conversations as never);
    await expect(service.list({ accountId: 'admin-1' })).rejects.toThrow('denied');
    expect(conversations.list).not.toHaveBeenCalled();
  });
});

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AdministrativeConversationReadController } from './administrative-conversation-read.controller.js';

describe('AdministrativeConversationReadController', () => {
  it('rejects unauthenticated reads', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue(null) };
    const conversations = { list: vi.fn() };
    const controller = new AdministrativeConversationReadController(principals as never, conversations as never);
    await expect(controller.list({} as never)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid limits before repository access', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const conversations = { list: vi.fn() };
    const controller = new AdministrativeConversationReadController(principals as never, conversations as never);
    await expect(controller.list({} as never, undefined, '0')).rejects.toBeInstanceOf(BadRequestException);
    expect(conversations.list).not.toHaveBeenCalled();
  });

  it('passes authenticated principal and validated pagination to the service', async () => {
    const principals = { resolveAccountId: vi.fn().mockResolvedValue('admin-1') };
    const conversations = { list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const controller = new AdministrativeConversationReadController(principals as never, conversations as never);
    await controller.list({} as never, 'cursor-1', '20');
    expect(conversations.list).toHaveBeenCalledWith({ accountId: 'admin-1', cursor: 'cursor-1', limit: 20 });
  });
});

import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { AccountLookupController } from './account-lookup.controller.js';

describe('AccountLookupController authentication boundary', () => {
  it('does not expose account lookup without authentication', async () => {
    const principal = { requireAuthenticated: vi.fn().mockRejectedValue(new UnauthorizedException()) };
    const accountLookup = { findById: vi.fn() };
    const controller = new AccountLookupController(accountLookup as never, principal as never);

    await expect(controller.findById('account-1')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(accountLookup.findById).not.toHaveBeenCalled();
  });

  it('allows an authenticated caller to use the existing lookup service', async () => {
    const principal = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'caller-1' }) };
    const account = { id: 'account-1', status: 'active', createdAt: new Date(), updatedAt: new Date() };
    const accountLookup = { findById: vi.fn().mockResolvedValue(account) };
    const controller = new AccountLookupController(accountLookup as never, principal as never);

    await expect(controller.findById('account-1', 'Bearer token')).resolves.toEqual(account);
    expect(principal.requireAuthenticated).toHaveBeenCalledWith({ authorization: 'Bearer token', requestId: 'account-lookup' });
  });
});
